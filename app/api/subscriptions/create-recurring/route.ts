import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import crypto from 'crypto';

interface RecurringPaymentRequest {
  planId: string;
  paymentStartDate?: string;
  totalPayments?: number;
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Giriş yapmalısınız' },
        { status: 401 }
      );
    }

    const body: RecurringPaymentRequest = await request.json();
    const { planId, paymentStartDate, totalPayments = 12 } = body;

    // Validate plan
    const { data: plan, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .eq('is_active', true)
      .single();

    if (planError || !plan) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz paket seçimi' },
        { status: 400 }
      );
    }

    // Check if user already has an active subscription
    const { data: existingSubscription } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (existingSubscription) {
      return NextResponse.json(
        { success: false, error: 'Zaten aktif bir aboneliğiniz var' },
        { status: 400 }
      );
    }

    // Get user profile for name and phone
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, phone')
      .eq('id', user.id)
      .single();

    const fullName = profile?.full_name || user.email?.split('@')[0] || 'Kullanıcı';
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    const phone = profile?.phone || '5555555555';

    // Generate client reference code
    const clientRefCode = `SUB-${Date.now()}-${user.id.substring(0, 8)}`;

    // Prepare start date
    const startDate = paymentStartDate || new Date().toLocaleDateString('tr-TR');

    // Prepare Paynkolay recurring payment request
    const sx = process.env.PAYNKOLAY_SX;
    const secretKey = process.env.PAYNKOLAY_SECRET_KEY;
    const baseUrl = process.env.PAYNKOLAY_BASE_URL;

    if (!sx || !secretKey || !baseUrl) {
      return NextResponse.json(
        { success: false, error: 'Ödeme sistemi yapılandırması eksik' },
        { status: 500 }
      );
    }

    // Calculate hashDatav2 for recurring payment
    // According to Paynkolay docs: sx + ClientRefCode + Amount + Email + Gsm + CustomerName + CustomerMiddleName + CustomerSurname + Description + secretKey
    const amount = plan.price.toString();
    const description = `${plan.name} - Aylık Abonelik`;

    const hashString = `${sx}${clientRefCode}${amount}${user.email}${phone}${firstName}${lastName}${description}${secretKey}`;
    const hashDatav2 = crypto.createHash('sha512').update(hashString, 'utf8').digest('base64');

    const recurringPaymentData = {
      sx,
      language: 'tr',
      Instalment: totalPayments,
      InstalmentPeriod: 30, // Monthly (must be 30 according to docs)
      CustomerName: firstName,
      CustomerMiddleName: '',
      CustomerSurname: lastName,
      ClientRefCode: clientRefCode,
      PaymentStartChose: paymentStartDate ? 2 : 1,
      PaymentStartDate: startDate,
      Email: user.email,
      Gsm: phone,
      Amount: amount,
      Description: description,
      hashDatav2,
    };

    // Call Paynkolay recurring payment API
    const paynkolayResponse = await fetch(`${baseUrl}/Vpos/api/RecurringPaymentCreate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recurringPaymentData),
    });

    const paynkolayResult = await paynkolayResponse.json();

    // Check if Paynkolay request was successful
    if (paynkolayResult.RESPONSE_CODE !== 2) {
      console.error('Paynkolay recurring payment error:', paynkolayResult);
      return NextResponse.json(
        {
          success: false,
          error: paynkolayResult.ERROR_MESSAGE || 'Düzenli ödeme talimatı oluşturulamadı',
        },
        { status: 400 }
      );
    }

    // Create subscription record in database
    const { data: subscription, error: subscriptionError } = await supabase
      .from('user_subscriptions')
      .insert({
        user_id: user.id,
        plan_id: planId,
        instruction_number: paynkolayResult.INSTRUCTION_NUMBER,
        status: 'pending',
        payment_start_date: startDate,
        total_payments: totalPayments,
        remaining_messages: plan.monthly_message_count,
        metadata: {
          client_ref_code: clientRefCode,
          paynkolay_response: paynkolayResult,
        },
      })
      .select()
      .single();

    if (subscriptionError) {
      console.error('Subscription creation error:', subscriptionError);
      return NextResponse.json(
        { success: false, error: 'Abonelik kaydı oluşturulamadı' },
        { status: 500 }
      );
    }

    // Return success with payment link
    return NextResponse.json({
      success: true,
      subscription_id: subscription.id,
      payment_link: paynkolayResult.LINK,
      instruction_number: paynkolayResult.INSTRUCTION_NUMBER,
    });

  } catch (error) {
    console.error('Create recurring payment error:', error);
    return NextResponse.json(
      { success: false, error: 'Beklenmeyen bir hata oluştu' },
      { status: 500 }
    );
  }
}
