# Paynkolay Integration Test Guide

## Overview
This guide provides step-by-step instructions for testing the Paynkolay payment integration in the GizliMesaj application.

## Prerequisites
- Development server running on `http://localhost:3000`
- Paynkolay test environment configured
- Valid test credentials in environment variables

## Test Scenarios

### 1. Template Form to Payment Flow

#### Steps:
1. Navigate to any template page (e.g., `/templates/yil-donumu`)
2. Fill out the form with required information:
   - Creator Name (Oluşturan Kişi Adı)
   - Email address
   - Recipient Name (Alıcı Adı)
   - Main Message (Ana Mesaj)
   - Select duration
   - Choose design style
3. Click "Ödeme Yap" (Make Payment) button
4. Verify redirect to payment page `/payment/[orderId]`
5. Verify payment form auto-submits to Paynkolay

#### Expected Results:
- Form validation works correctly
- Payment API creates order with buyer_email
- Redirect to payment page with correct order ID
- Payment form displays loading state then auto-submits

### 2. Payment Success Flow

#### Steps:
1. Complete a successful test payment through Paynkolay
2. Verify redirect to success callback `/api/payments/paynkolay-success`
3. Check that order status is updated to 'completed'
4. Verify personal page is created
5. Check that success email is sent

#### Expected Results:
- Order status: 'completed'
- Personal page created with correct short_id
- Email sent to buyer_email
- Redirect to success page

### 3. Payment Failure Flow

#### Steps:
1. Initiate a payment that will fail (use invalid card details)
2. Verify redirect to fail callback `/api/payments/paynkolay-fail`
3. Check that order status is updated to 'failed'
4. Verify redirect to error page

#### Expected Results:
- Order status: 'failed'
- No personal page created
- Redirect to error page with appropriate message

### 4. Database Verification

#### Check Orders Table:
```sql
SELECT 
  id, 
  template_id, 
  recipient_name, 
  sender_name, 
  message, 
  buyer_email, 
  status, 
  payment_provider, 
  payment_reference,
  created_at
FROM orders 
ORDER BY created_at DESC 
LIMIT 10;
```

#### Check Personal Pages Table:
```sql
SELECT 
  id, 
  order_id, 
  short_id, 
  template_id, 
  recipient_name, 
  sender_name, 
  is_active,
  created_at
FROM personal_pages 
ORDER BY created_at DESC 
LIMIT 10;
```

## API Endpoints to Test

### 1. Create Payment
- **Endpoint**: `POST /api/payments/create-payment`
- **Payload**:
```json
{
  "template_id": "template-uuid",
  "recipient_name": "Test Recipient",
  "sender_name": "Test Sender",
  "message": "Test message",
  "buyer_email": "test@example.com",
  "special_date": "2024-12-31",
  "expires_in_hours": 24
}
```

### 2. Success Callback
- **Endpoint**: `POST /api/payments/paynkolay-success`
- **Content-Type**: `application/x-www-form-urlencoded`
- **Test with Paynkolay response parameters**

### 3. Fail Callback
- **Endpoint**: `POST /api/payments/paynkolay-fail`
- **Content-Type**: `application/x-www-form-urlencoded`
- **Test with Paynkolay error response parameters**

## Environment Variables Required

```env
# Paynkolay Configuration
PAYNKOLAY_SX=your_sx_value
PAYNKOLAY_SECRET_KEY=your_secret_key
PAYNKOLAY_BASE_URL=https://paynkolaytest.nkolayislem.com.tr/Vpos
PAYNKOLAY_SUCCESS_URL=http://localhost:3000/api/payments/paynkolay-success
PAYNKOLAY_FAIL_URL=http://localhost:3000/api/payments/paynkolay-fail
PAYNKOLAY_USE_3D=true
PAYNKOLAY_TRANSACTION_TYPE=sales
PAYNKOLAY_LANGUAGE=tr

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Common Issues and Troubleshooting

### 1. Hash Validation Errors
- Verify all parameters are included in hash calculation
- Check parameter order matches Paynkolay documentation
- Ensure secret key is correct

### 2. Email Not Sending
- Check email service configuration
- Verify buyer_email is properly stored in orders table
- Check email service logs

### 3. Personal Page Not Created
- Verify order status is 'completed'
- Check for database errors in logs
- Ensure all required fields are present

### 4. Payment Form Not Auto-Submitting
- Check browser console for JavaScript errors
- Verify payment form data is correctly populated
- Check network requests in browser dev tools

## Manual Testing Checklist

- [ ] Template form validation works
- [ ] Payment creation API works
- [ ] Payment form auto-submits
- [ ] Success callback processes correctly
- [ ] Fail callback processes correctly
- [ ] Order status updates properly
- [ ] Personal pages are created
- [ ] Emails are sent
- [ ] Database records are correct
- [ ] Error handling works properly

## Automated Testing

Consider adding these test cases to your test suite:
- Unit tests for PaynkolayHelper class
- Integration tests for payment API endpoints
- End-to-end tests for complete payment flow
- Database migration tests
- Email service tests

## Security Considerations

- Hash validation is properly implemented
- Sensitive data is not logged
- Environment variables are secure
- HTTPS is used in production
- Rate limiting is in place