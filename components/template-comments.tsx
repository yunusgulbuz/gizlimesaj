'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { User } from '@supabase/supabase-js';
import { StarRating } from '@/components/ui/star-rating';

interface Comment {
  id: string;
  template_id: string;
  user_id: string;
  comment: string;
  created_at: string | null;
  updated_at: string | null;
  display_name: string | null;
  avatar_url?: string;
  like_count: number;
  user_has_liked: boolean;
}

interface TemplateCommentsProps {
  templateId: string;
  user?: Pick<User, 'id'> | null;
  userRating?: number | null;
  ratingSummary?: { average: number | null; total: number };
  onRatingSummaryChange?: (stats: { averageRating: number; totalRatings: number }) => void;
  onUserRatingChange?: (rating: number | null) => void;
  onCountChange?: (count: number) => void;
}

export function TemplateComments({
  templateId,
  user,
  userRating = 0,
  ratingSummary,
  onRatingSummaryChange,
  onUserRatingChange,
  onCountChange,
}: TemplateCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRatingSaving, setIsRatingSaving] = useState(false);
  const [pendingRating, setPendingRating] = useState<number>(userRating ?? 0);
  const [savedRating, setSavedRating] = useState<number>(userRating ?? 0);
  const [averageRatingState, setAverageRatingState] = useState<number>(ratingSummary?.average ?? 0);
  const [totalRatingsState, setTotalRatingsState] = useState<number>(ratingSummary?.total ?? 0);
  const [userHasCommented, setUserHasCommented] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const router = useRouter();

  useEffect(() => {
    setPendingRating(userRating ?? 0);
    setSavedRating(userRating ?? 0);
  }, [userRating]);

  useEffect(() => {
    if (ratingSummary) {
      setAverageRatingState(ratingSummary.average ?? 0);
      setTotalRatingsState(ratingSummary.total ?? 0);
    }
  }, [ratingSummary]);

  const isValidComment = useCallback((comment: unknown): comment is Comment => {
    if (!comment || typeof comment !== 'object') {
      return false;
    }
    const candidate = comment as Partial<Comment>;
    return typeof candidate.id === 'string' && typeof candidate.comment === 'string';
  }, []);

  const sanitizeComment = useCallback(
    (comment: unknown): Comment | null => {
      if (!isValidComment(comment)) {
        return null;
      }
      return comment;
    },
    [isValidComment]
  );

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/templates/${templateId}/comments?page=${pagination.page}&limit=${pagination.limit}`
      );

      if (response.ok) {
        const data = await response.json();
        const sanitized = (data.comments ?? []).map(sanitizeComment).filter(Boolean) as Comment[];
        setComments(sanitized);
        setPagination(prev => ({
          ...prev,
          page: data.pagination?.page ?? prev.page,
          limit: data.pagination?.limit ?? prev.limit,
          total: data.pagination?.total ?? sanitized.length,
          totalPages: data.pagination?.totalPages ?? prev.totalPages,
        }));

        if (user) {
          setUserHasCommented(sanitized.some(comment => comment.user_id === user.id));
        }
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Yorumlar yüklenemedi');
    } finally {
      setIsLoading(false);
    }
  }, [templateId, pagination.page, pagination.limit, sanitizeComment, user]);

  const fetchRatingSummary = useCallback(async () => {
    try {
      const response = await fetch(`/api/templates/${templateId}/ratings`);
      if (response.ok) {
        const data = await response.json();
        setAverageRatingState(data.averageRating ?? 0);
        setTotalRatingsState(data.totalRatings ?? 0);
        const normalizedRating = data.userRating || 0;
        setSavedRating(normalizedRating);
        setPendingRating(normalizedRating);
        onRatingSummaryChange?.({
          averageRating: data.averageRating,
          totalRatings: data.totalRatings,
        });
        onUserRatingChange?.(data.userRating ?? null);
      }
    } catch (error) {
      console.error('Error fetching rating summary:', error);
    }
  }, [templateId, onRatingSummaryChange, onUserRatingChange]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  useEffect(() => {
    fetchRatingSummary();
  }, [fetchRatingSummary]);

  useEffect(() => {
    onCountChange?.(pagination.total);
  }, [pagination.total, onCountChange]);

  const handleSaveRating = useCallback(async (value?: number) => {
    if (!user) {
      toast.error('Puan vermek için giriş yapmalısınız');
      router.push('/login');
      return false;
    }

    const nextRating = value ?? pendingRating;

    if (nextRating <= 0) {
      toast.error('Puan vermek için minimum bir yıldız seçin');
      return false;
    }

    if (nextRating === savedRating) {
      return true;
    }

    setIsRatingSaving(true);
    try {
      const response = await fetch(`/api/templates/${templateId}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating: nextRating }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Puan kaydedilemedi');
        return false;
      }

      const resolvedRating = data.rating ?? nextRating;
      setSavedRating(resolvedRating);
      setPendingRating(resolvedRating);
      setAverageRatingState(data.averageRating ?? 0);
      setTotalRatingsState(data.totalRatings ?? 0);
      toast.success('Puanınız kaydedildi');
      onRatingSummaryChange?.({
        averageRating: data.averageRating,
        totalRatings: data.totalRatings,
      });
      onUserRatingChange?.(data.rating ?? resolvedRating ?? null);
      return true;
    } catch (error) {
      console.error('Error saving rating:', error);
      toast.error('Puan kaydedilirken bir hata oluştu');
      return false;
    } finally {
      setIsRatingSaving(false);
    }
  }, [pendingRating, savedRating, templateId, user, router, onRatingSummaryChange, onUserRatingChange]);

  const handleInlineRatingChange = useCallback(
    (value: number) => {
      setPendingRating(value);
      handleSaveRating(value).then((success) => {
        if (!success) {
          setPendingRating(savedRating);
        }
      });
    },
    [handleSaveRating, savedRating]
  );

  const handleSubmitComment = async () => {
    if (!user) {
      toast.error('Yorum yapmak için giriş yapmalısınız');
      router.push('/login');
      return;
    }

    if (pendingRating <= 0) {
      toast.error('Yorum yapmak için lütfen önce puan verin');
      return;
    }

    if (!newComment.trim() || newComment.trim().length < 10) {
      toast.error('Yorum en az 10 karakter olmalıdır');
      return;
    }

    if (isRatingSaving || isSubmitting) {
      return;
    }

    const ratingSaved = await handleSaveRating();
    if (!ratingSaved) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/templates/${templateId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment: newComment.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        const inserted = sanitizeComment(data.comment);
        if (inserted) {
          setComments([inserted, ...comments]);
          setUserHasCommented(true);
        }
        setNewComment('');
        setPagination(prev => {
          const newTotal = prev.total + 1;
          return {
            ...prev,
            total: newTotal,
            totalPages: newTotal === 0 ? 0 : Math.ceil(newTotal / prev.limit),
          };
        });
        await fetchRatingSummary();
        toast.success('Yorumunuz eklendi!');
      } else {
        toast.error(data.error || 'Yorum eklenemedi');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast.error('Bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editText.trim() || editText.trim().length < 10) {
      toast.error('Yorum en az 10 karakter olmalıdır');
      return;
    }

    try {
      const response = await fetch(`/api/templates/${templateId}/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment: editText.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        const updated = sanitizeComment(data.comment);
        if (updated) {
          setComments(comments.map(comment => (comment.id === commentId ? updated : comment)));
        }
        setEditingComment(null);
        setEditText('');
        toast.success('Yorum güncellendi!');
      } else {
        toast.error(data.error || 'Yorum güncellenemedi');
      }
    } catch (error) {
      console.error('Error editing comment:', error);
      toast.error('Bir hata oluştu');
    }
  };

  const deleteRatingForUser = useCallback(async () => {
    try {
      const response = await fetch(`/api/templates/${templateId}/ratings`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSavedRating(0);
        setPendingRating(0);
        onUserRatingChange?.(null);
        await fetchRatingSummary();
      }
    } catch (error) {
      console.error('Error deleting rating:', error);
    }
  }, [templateId, fetchRatingSummary, onUserRatingChange]);

  const deleteCommentRequest = useCallback(async (commentId: string) => {
    try {
      const response = await fetch(`/api/templates/${templateId}/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setComments(comments.filter(comment => comment.id !== commentId));
        setPagination(prev => {
          const newTotal = Math.max(prev.total - 1, 0);
          return {
            ...prev,
            total: newTotal,
            totalPages: newTotal === 0 ? 0 : Math.ceil(newTotal / prev.limit),
          };
        });
        return true;
      }

      const data = await response.json();
      toast.error(data.error || 'Yorum silinemedi');
      return false;
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Bir hata oluştu');
      return false;
    }
  }, [comments, templateId]);

  const handleCommentDelete = async (comment: Comment) => {
    if (!confirm('Bu yorumu silmek istediğinizden emin misiniz?')) {
      return;
    }

    const removed = await deleteCommentRequest(comment.id);
    if (removed) {
      toast.success('Yorum silindi');
      if (user && user.id === comment.user_id) {
        setUserHasCommented(false);
        await deleteRatingForUser();
      }
    }
  };

  const handleLikeComment = async (commentId: string, isLiked: boolean) => {
    if (!user) {
      toast.error('Beğenmek için giriş yapmalısınız');
      router.push('/login');
      return;
    }

    try {
      const response = await fetch(`/api/templates/${templateId}/comments/${commentId}/like`, {
        method: isLiked ? 'DELETE' : 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setComments(comments.map(comment =>
          comment.id === commentId
            ? {
                ...comment,
                like_count: data.likeCount,
                user_has_liked: data.liked,
              }
            : comment
        ));
      } else {
        toast.error(data.error || 'İşlem başarısız');
      }
    } catch (error) {
      console.error('Error liking comment:', error);
      toast.error('Bir hata oluştu');
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) {
      return '—';
    }
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return '—';
    }
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) {
      return 'HN';
    }
    const initials = name
      .split(' ')
      .filter(Boolean)
      .map(word => word[0] || '')
      .join('')
      .toUpperCase()
      .slice(0, 2);

    return initials || 'HN';
  };

  const totalPagesDisplay = pagination.totalPages || (pagination.total > 0 ? Math.ceil(pagination.total / pagination.limit) : 0);

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
              <MessageCircle className="w-5 h-5 text-rose-500" />
              Yorumlar & Değerlendirmeler ({pagination.total})
            </CardTitle>
            <p className="text-sm text-gray-500">
              Heartnote şablonunu deneyimleyen kullanıcıların görüşlerini inceleyin.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 text-sm text-gray-600 md:items-end">
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-start gap-1 md:items-end">
                <div className="flex items-baseline gap-2 text-2xl font-semibold text-gray-900">
                  <span>{averageRatingState ? averageRatingState.toFixed(1) : '—'}</span>
                  <span className="text-sm font-normal text-gray-400">/ 5</span>
                </div>
                <StarRating rating={averageRatingState} readonly size="md" />
              </div>
              <div className="text-xs text-gray-500">
                <div><span className="font-semibold text-gray-800">{totalRatingsState}</span> değerlendirme</div>
                <div><span className="font-semibold text-gray-800">{pagination.total}</span> yorum</div>
              </div>
            </div>
          </div>
        </div>
       <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">Puanınız</span>
              <div className="flex items-center gap-3">
                <StarRating rating={pendingRating} onRatingChange={handleInlineRatingChange} size="lg" />
                {savedRating > 0 && (
                  <span className="text-xs text-gray-500">
                    Son kaydedilen puanınız: <span className="font-medium text-gray-800">{savedRating}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          {user ? (
            <>
              <Textarea
                placeholder="Yorumunuzu yazın... (En az 10 karakter)"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px]"
                maxLength={1000}
              />
              {userHasCommented && (
                <p className="text-xs text-amber-600">
                  Daha önce bu şablon için yorum yaptınız. Dilerseniz mevcut yorumunuzu güncelleyebilirsiniz.
                </p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {newComment.length}/1000 karakter
                </span>
                <Button
                  onClick={handleSubmitComment}
                  disabled={isSubmitting || isRatingSaving || newComment.trim().length < 10}
                >
                  {isSubmitting ? 'Gönderiliyor...' : 'Puanla ve Yorum Yap'}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center rounded-lg border border-dashed border-gray-200 bg-white/60 py-6">
              <p className="mb-3 text-gray-600">Yorum yapmak için oturum açın</p>
              <Button onClick={() => router.push('/login')} variant="outline" size="sm">
                Giriş Yap
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="py-8 text-center">
              <p className="text-gray-500">Yorumlar yükleniyor...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-gray-500">Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
            </div>
          ) : (
            comments.map((comment) => {
              const displayName = comment?.display_name || 'Heartnote Kullanıcısı';
              return (
                <div key={comment.id} className="rounded-2xl border border-gray-100 bg-white/70 p-4 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={comment?.avatar_url ?? undefined} />
                        <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{displayName}</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(comment.created_at)}
                          {comment.updated_at && comment.updated_at !== comment.created_at && ' · (düzenlendi)'}
                        </p>
                      </div>
                    </div>

                    {user && user.id === comment.user_id && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingComment(comment.id);
                              setEditText(comment.comment);
                            }}
                          >
                            <Edit2 className="mr-2 h-4 w-4" />
                            Düzenle
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleCommentDelete(comment)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Sil
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>

                  {editingComment === comment.id ? (
                    <div className="mt-3 space-y-2">
                      <Textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="min-h-[80px]"
                        maxLength={1000}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleEditComment(comment.id)}
                          disabled={editText.trim().length < 10}
                        >
                          Kaydet
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingComment(null);
                            setEditText('');
                          }}
                        >
                          İptal
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 space-y-3">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {comment.comment}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLikeComment(comment.id, comment.user_has_liked)}
                          className={comment.user_has_liked ? 'text-rose-500' : 'text-gray-500'}
                        >
                          <Heart
                            className={`mr-1 h-4 w-4 ${comment.user_has_liked ? 'fill-current' : ''}`}
                          />
                          {comment.like_count}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {totalPagesDisplay > 1 && (
          <div className="flex flex-col items-center gap-3 border-t border-gray-100 pt-4">
            <p className="text-xs text-gray-500">
              Sayfa {pagination.page} / {totalPagesDisplay}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
              >
                Önceki
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === totalPagesDisplay}
              >
                Sonraki
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
