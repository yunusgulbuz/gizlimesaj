import { Suspense } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import {
  ArrowLeft,
  MessageSquare,
  ThumbsUp
} from 'lucide-react';
import { createAuthSupabaseClient } from '@/lib/supabase-auth-server';

interface Comment {
  id: string;
  comment: string;
  is_approved: boolean;
  created_at: string;
  template: {
    title: string;
    slug: string;
  } | null;
}

async function getComments(): Promise<Comment[]> {
  const supabase = await createAuthSupabaseClient();

  const { data: comments, error } = await supabase
    .from('template_comments')
    .select(`
      id,
      comment,
      is_approved,
      created_at,
      template:templates(title, slug)
    `)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }

  return comments as Comment[] || [];
}

function CommentsTable({ comments }: { comments: Comment[] }) {
  if (comments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Yorum bulunamadı</h3>
          <p className="text-muted-foreground text-center">
            Henüz hiç yorum yapılmamış.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Card key={comment.id}>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {comment.template && (
                      <span className="font-medium">{comment.template.title}</span>
                    )}
                    <Badge className={comment.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {comment.is_approved ? 'Onaylandı' : 'Bekliyor'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(comment.created_at).toLocaleDateString('tr-TR')} •
                    {new Date(comment.created_at).toLocaleTimeString('tr-TR')}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm">{comment.comment}</p>
              </div>

              <div className="flex items-center gap-2">
                {!comment.is_approved && (
                  <Button size="sm" variant="outline">
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Onayla
                  </Button>
                )}
                <Button size="sm" variant="outline">
                  Sil
                </Button>
                {comment.template && (
                  <Button size="sm" variant="ghost" asChild>
                    <Link href={`/templates/${comment.template.slug}`} target="_blank">
                      Şablonu Görüntüle
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default async function AdminCommentsPage() {
  const comments = await getComments();

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Yönetim', href: '/admin' },
    { label: 'Yorumlar' }
  ];

  const pendingCount = comments.filter(c => !c.is_approved).length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Geri
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Yorumlar</h1>
            <p className="text-muted-foreground">
              {comments.length} yorum ({pendingCount} bekliyor)
            </p>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <Suspense fallback={<div>Yükleniyor...</div>}>
        <CommentsTable comments={comments} />
      </Suspense>
    </div>
  );
}
