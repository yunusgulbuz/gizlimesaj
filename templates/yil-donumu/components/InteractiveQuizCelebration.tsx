'use client';

import { useMemo, useState } from 'react';
import type { TemplateTextFields } from '../../shared/types';

interface InteractiveQuizCelebrationProps {
  recipientName: string;
  creatorName?: string;
  textFields?: TemplateTextFields;
  primaryMessage?: string;
}

interface QuizItem {
  question: string;
  answer: string;
  hint?: string;
  memory?: string;
}

const FALLBACK_QUIZ = `İlk nerede tanıştık?|Üniversite kütüphanesi|Sessizliğin arasında göz göze geldiğimiz an.|Kütüphane
En sevdiğimiz film?|Amélie|Her sahnesinde birbirimize gülümsediğimiz film.|Fransız film
İlk ortak şarkımız?|Yellow|Konserde ellerimiz kenetlenmişti.|Coldplay
En unutulmaz seyahatimiz?|Kapadokya|Gün doğarken balonlardan selam vermiştik.|Balonlar`;

export default function InteractiveQuizCelebration({
  recipientName,
  creatorName,
  textFields,
  primaryMessage
}: InteractiveQuizCelebrationProps) {
  const questions = useMemo<QuizItem[]>(() => {
    const raw = (textFields?.quizItems && textFields.quizItems.trim().length > 0)
      ? textFields.quizItems
      : FALLBACK_QUIZ;

    return raw
      .split('\n')
      .map(line => {
        const [question, answer, memory, hint] = line.split('|').map(part => part?.trim() || '');
        if (!question || !answer) return null;
        return {
          question,
          answer: answer.toLowerCase(),
          memory,
          hint
        };
      })
      .filter(Boolean) as QuizItem[];
  }, [textFields?.quizItems]);

  const [gameStarted, setGameStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [revealedMemories, setRevealedMemories] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleStart = () => {
    if (questions.length === 0) return;
    setGameStarted(true);
    setCurrentIndex(0);
    setUserAnswer('');
    setScore(0);
    setRevealedMemories([]);
    setCompleted(false);
  };

  const checkAnswer = () => {
    if (!currentQuestion) return;
    const normalized = userAnswer.trim().toLowerCase();
    if (!normalized) return;

    if (normalized === currentQuestion.answer.toLowerCase()) {
      const nextScore = score + 50;
      setScore(nextScore);
      if (currentQuestion.memory) {
        setRevealedMemories(prev => [...prev, currentQuestion.memory as string]);
      }
      if (currentIndex === questions.length - 1) {
        setCompleted(true);
        setUserAnswer('');
      } else {
        setCurrentIndex(prev => prev + 1);
        setUserAnswer('');
      }
    } else {
      setScore(prev => Math.max(0, prev - 10));
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-600 via-purple-600 to-orange-500 px-4 py-16 text-white">
      <style>{`
        @keyframes float-balloons {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
      <div className="absolute inset-0">
        <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white/10 via-transparent to-transparent" />
        <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white/10 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col gap-10">
        <div className="text-center">
          {creatorName && (
            <p className="mb-2 text-xs uppercase tracking-[0.35em] text-white/70">Hazırlayan: {creatorName}</p>
          )}
          <p className="text-sm uppercase tracking-[0.4em] text-white/80">Eğlenceli Kutlama Oyunu</p>
          <h1 className="mt-4 text-4xl md:text-6xl font-bold text-white drop-shadow-xl">
            {textFields?.quizHeadline || 'Mutlu Yıl Dönümü'}
          </h1>
          <p className="mt-3 text-base text-white/80">
            {recipientName ? `${recipientName} ile kutlamaya hazır mısın?` : primaryMessage || 'Kelimelerin seni zamana geri götürsün!'}
          </p>
        </div>

        {!gameStarted && !completed && (
          <div className="mx-auto flex max-w-xl flex-col items-center gap-6 rounded-3xl border border-white/20 bg-white/10 p-8 text-center backdrop-blur-lg">
            <div className="text-5xl">🎈</div>
            <p className="text-lg text-white/80">
              {textFields?.quizIntro || textFields?.mainMessage || primaryMessage || 'Mini bir aşk quizine hazır mısın? Her doğru cevap yeni bir hatırayı gün yüzüne çıkaracak!'}
            </p>
            <button
              onClick={handleStart}
              className="rounded-full bg-white px-10 py-3 text-sm font-semibold uppercase tracking-[0.4em] text-purple-600 transition hover:scale-105"
            >
              {textFields?.quizButtonLabel || 'Kutlamayı Başlat'}
            </button>
          </div>
        )}

        {gameStarted && !completed && currentQuestion && (
          <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col gap-6 rounded-3xl border border-white/30 bg-white/15 p-8 backdrop-blur-lg">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-white/70">
                <span>Soru {currentIndex + 1} / {questions.length}</span>
                <span>Skor: {score}</span>
              </div>
              <div className="text-5xl">🧩</div>
              <p className="text-2xl font-semibold text-white">
                {currentQuestion.question}
              </p>
              <input
                value={userAnswer}
                onChange={e => setUserAnswer(e.target.value)}
                onKeyDown={event => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    checkAnswer();
                  }
                }}
                placeholder="Cevabını yaz..."
                className="rounded-2xl border border-white/30 bg-white/20 px-5 py-3 text-base text-white placeholder:text-white/60 focus:border-white focus:outline-none"
              />
              <button
                onClick={checkAnswer}
                className="rounded-full bg-white/90 px-8 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-purple-700 transition hover:bg-white"
              >
                Yanıtla
              </button>
              <p className="text-xs uppercase tracking-[0.35em] text-white/60">
                {textFields?.quizHintLabel || 'İpucu'}: {currentQuestion.hint || 'Kalbini dinle'}
              </p>
            </div>

            <div className="flex flex-col gap-6 rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-lg">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-white/70">
                <span>Hatıralar</span>
                <span>{revealedMemories.length} / {questions.length}</span>
              </div>
              <div className="grid flex-1 place-items-center rounded-3xl border border-white/30 bg-white/10 p-6" style={{ animation: 'float-balloons 6s ease-in-out infinite' }}>
                <div className="text-center text-white/80">
                  {revealedMemories.length === 0 ? (
                    <p className="text-sm text-white/70">Doğru cevaplar geldikçe anılar belirleyecek.</p>
                  ) : (
                    <ul className="space-y-3 text-left text-sm leading-relaxed">
                      {revealedMemories.map((memory, index) => (
                        <li key={`${memory}-${index}`} className="rounded-xl bg-white/10 p-3">
                          {memory}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {completed && (
          <div className="relative overflow-hidden rounded-[3rem] border border-white/30 bg-white/15 p-10 text-center backdrop-blur-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent)]" />
            <div className="relative z-10 flex flex-col items-center gap-6">
              <div className="text-6xl">🎆</div>
              <h2 className="text-3xl font-bold text-white md:text-5xl">
                {textFields?.quizCompletionTitle || 'Harikasın!'}
              </h2>
              <p className="text-lg text-white/80 max-w-2xl">
                {textFields?.quizCompletionMessage || textFields?.mainMessage || primaryMessage || 'Soruların hepsini yanıtladın ve hatıra kutumuz parladı! İşte tüm soruların altında saklanan özel mesaj:'}
              </p>
              <div className="w-full rounded-3xl border border-white/30 bg-white/20 p-6 text-base text-white/90">
                {textFields?.quizFinalMessage || textFields?.mainMessage || primaryMessage || 'Birlikte her sorunun yanıtını bulduk ve her yanıt bizi yeniden birbirimize getirdi. Mutlu Yıl Dönümü!'}
              </div>
              <p className="text-sm uppercase tracking-[0.35em] text-white/70">Skorun: {score}</p>
              <button
                onClick={handleStart}
                className="rounded-full bg-white px-8 py-3 text-sm font-semibold uppercase tracking-[0.4em] text-purple-600 transition hover:scale-105"
              >
                {textFields?.quizReplay || 'Tekrar Oyna'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
