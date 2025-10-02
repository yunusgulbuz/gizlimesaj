'use client';

import { useMemo, useState, useEffect } from 'react';
import type { TemplateTextFields } from '../../shared/types';

interface InteractiveQuizCelebrationProps {
  recipientName: string;
  creatorName?: string;
  textFields?: TemplateTextFields;
  primaryMessage?: string;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
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
  primaryMessage,
  isEditable = false,
  onTextFieldChange
}: InteractiveQuizCelebrationProps) {
  // Local editable state
  const [localRecipientName, setLocalRecipientName] = useState(recipientName);
  const [localHeadline, setLocalHeadline] = useState('');
  const [localIntro, setLocalIntro] = useState('');
  const [localButtonLabel, setLocalButtonLabel] = useState('');
  const [localCompletionTitle, setLocalCompletionTitle] = useState('');
  const [localCompletionMessage, setLocalCompletionMessage] = useState('');
  const [localFinalMessage, setLocalFinalMessage] = useState('');
  const [localReplayLabel, setLocalReplayLabel] = useState('');

  // Initialize local state with text fields
  useEffect(() => {
    setLocalRecipientName(recipientName);
    setLocalHeadline(textFields?.quizHeadline || 'Mutlu Yıl Dönümü');
    setLocalIntro(textFields?.quizIntro || textFields?.mainMessage || primaryMessage || 'Mini bir aşk quizine hazır mısın? Her doğru cevap yeni bir hatırayı gün yüzüne çıkaracak!');
    setLocalButtonLabel(textFields?.quizButtonLabel || 'Kutlamayı Başlat');
    setLocalCompletionTitle(textFields?.quizCompletionTitle || 'Harikasın!');
    setLocalCompletionMessage(textFields?.quizCompletionMessage || textFields?.mainMessage || primaryMessage || 'Soruların hepsini yanıtladın ve hatıra kutumuz parladı! İşte tüm soruların altında saklanan özel mesaj:');
    setLocalFinalMessage(textFields?.quizFinalMessage || textFields?.mainMessage || primaryMessage || 'Birlikte her sorunun yanıtını bulduk ve her yanıt bizi yeniden birbirimize getirdi. Mutlu Yıl Dönümü!');
    setLocalReplayLabel(textFields?.quizReplay || 'Tekrar Oyna');
  }, [recipientName, textFields, primaryMessage]);

  // Handle content change
  const handleContentChange = (key: string, value: string) => {
    if (key === 'recipientName') setLocalRecipientName(value);
    else if (key === 'quizHeadline') setLocalHeadline(value);
    else if (key === 'quizIntro') setLocalIntro(value);
    else if (key === 'quizButtonLabel') setLocalButtonLabel(value);
    else if (key === 'quizCompletionTitle') setLocalCompletionTitle(value);
    else if (key === 'quizCompletionMessage') setLocalCompletionMessage(value);
    else if (key === 'quizFinalMessage') setLocalFinalMessage(value);
    else if (key === 'quizReplay') setLocalReplayLabel(value);

    if (onTextFieldChange) {
      onTextFieldChange(key, value);
    }
  };

  // Get display values
  const headline = isEditable ? localHeadline : (textFields?.quizHeadline || 'Mutlu Yıl Dönümü');
  const introMessage = isEditable ? localIntro : (textFields?.quizIntro || textFields?.mainMessage || primaryMessage || 'Mini bir aşk quizine hazır mısın? Her doğru cevap yeni bir hatırayı gün yüzüne çıkaracak!');
  const buttonLabel = isEditable ? localButtonLabel : (textFields?.quizButtonLabel || 'Kutlamayı Başlat');
  const completionTitle = isEditable ? localCompletionTitle : (textFields?.quizCompletionTitle || 'Harikasın!');
  const completionMessage = isEditable ? localCompletionMessage : (textFields?.quizCompletionMessage || textFields?.mainMessage || primaryMessage || 'Soruların hepsini yanıtladın ve hatıra kutumuz parladı! İşte tüm soruların altında saklanan özel mesaj:');
  const finalMessage = isEditable ? localFinalMessage : (textFields?.quizFinalMessage || textFields?.mainMessage || primaryMessage || 'Birlikte her sorunun yanıtını bulduk ve her yanıt bizi yeniden birbirimize getirdi. Mutlu Yıl Dönümü!');
  const replayLabel = isEditable ? localReplayLabel : (textFields?.quizReplay || 'Tekrar Oyna');
  const displayRecipientName = isEditable ? localRecipientName : recipientName;

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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-600 via-purple-600 to-orange-500 p-4 sm:p-6 md:p-8 py-12 sm:py-16 text-white">
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

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col gap-8 sm:gap-10">
        <div className="text-center">
          {creatorName && (
            <p className="mb-2 text-xs uppercase tracking-[0.35em] text-white/70">Hazırlayan: {creatorName}</p>
          )}
          <p className="text-sm uppercase tracking-[0.4em] text-white/80 break-words">Eğlenceli Kutlama Oyunu</p>
          <h1
            className={`mt-3 sm:mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-xl break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded-lg p-2 transition-colors' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleContentChange('quizHeadline', e.currentTarget.textContent || '')}
          >
            {headline}
          </h1>
          <p
            className={`mt-2 sm:mt-3 text-sm sm:text-base md:text-lg text-white/80 break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded-lg p-2 transition-colors' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleContentChange('recipientName', e.currentTarget.textContent?.replace(' ile kutlamaya hazır mısın?', '') || '')}
          >
            {displayRecipientName ? `${displayRecipientName} ile kutlamaya hazır mısın?` : primaryMessage || 'Kelimelerin seni zamana geri götürsün!'}
          </p>
        </div>

        {!gameStarted && !completed && (
          <div className="mx-auto flex max-w-xl flex-col items-center gap-4 sm:gap-6 rounded-2xl sm:rounded-3xl border border-white/20 bg-white/10 p-6 sm:p-8 text-center backdrop-blur-lg">
            <div className="text-4xl sm:text-5xl">🎈</div>
            <p
              className={`text-base sm:text-lg md:text-xl text-white/80 break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded-lg p-2 transition-colors' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange('quizIntro', e.currentTarget.textContent || '')}
            >
              {introMessage}
            </p>
            <button
              onClick={handleStart}
              className={`rounded-full bg-white px-8 sm:px-10 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.4em] text-purple-600 transition hover:scale-105 break-words ${isEditable ? 'hover:bg-gray-100 cursor-text' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange('quizButtonLabel', e.currentTarget.textContent || '')}
            >
              {buttonLabel}
            </button>
          </div>
        )}

        {gameStarted && !completed && currentQuestion && (
          <div className="grid gap-6 sm:gap-8 md:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col gap-4 sm:gap-6 rounded-2xl sm:rounded-3xl border border-white/30 bg-white/15 p-6 sm:p-8 backdrop-blur-lg">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-white/70">
                <span>Soru {currentIndex + 1} / {questions.length}</span>
                <span>Skor: {score}</span>
              </div>
              <div className="text-4xl sm:text-5xl">🧩</div>
              <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-white break-words">
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
                className="rounded-xl sm:rounded-2xl border border-white/30 bg-white/20 px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder:text-white/60 focus:border-white focus:outline-none"
              />
              <button
                onClick={checkAnswer}
                className="rounded-full bg-white/90 px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.35em] text-purple-700 transition hover:bg-white"
              >
                Yanıtla
              </button>
              <p className="text-xs uppercase tracking-[0.35em] text-white/60 break-words">
                {textFields?.quizHintLabel || 'İpucu'}: {currentQuestion.hint || 'Kalbini dinle'}
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:gap-6 rounded-2xl sm:rounded-3xl border border-white/20 bg-white/10 p-6 sm:p-8 backdrop-blur-lg">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-white/70">
                <span>Hatıralar</span>
                <span>{revealedMemories.length} / {questions.length}</span>
              </div>
              <div className="grid flex-1 place-items-center rounded-2xl sm:rounded-3xl border border-white/30 bg-white/10 p-4 sm:p-6" style={{ animation: 'float-balloons 6s ease-in-out infinite' }}>
                <div className="text-center text-white/80">
                  {revealedMemories.length === 0 ? (
                    <p className="text-sm text-white/70 break-words">Doğru cevaplar geldikçe anılar belirleyecek.</p>
                  ) : (
                    <ul className="space-y-2 sm:space-y-3 text-left text-sm leading-relaxed">
                      {revealedMemories.map((memory, index) => (
                        <li key={`${memory}-${index}`} className="rounded-lg sm:rounded-xl bg-white/10 p-2.5 sm:p-3 break-words">
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
          <div className="relative overflow-hidden rounded-2xl sm:rounded-[3rem] border border-white/30 bg-white/15 p-6 sm:p-8 md:p-10 text-center backdrop-blur-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent)]" />
            <div className="relative z-10 flex flex-col items-center gap-4 sm:gap-6">
              <div className="text-5xl sm:text-6xl">🎆</div>
              <h2
                className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded-lg p-2 transition-colors' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleContentChange('quizCompletionTitle', e.currentTarget.textContent || '')}
              >
                {completionTitle}
              </h2>
              <p
                className={`text-base sm:text-lg md:text-xl text-white/80 max-w-2xl break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded-lg p-2 transition-colors' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleContentChange('quizCompletionMessage', e.currentTarget.textContent || '')}
              >
                {completionMessage}
              </p>
              <div
                className={`w-full rounded-2xl sm:rounded-3xl border border-white/30 bg-white/20 p-4 sm:p-6 text-sm sm:text-base md:text-lg text-white/90 break-words ${isEditable ? 'hover:bg-white/10 cursor-text transition-colors' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleContentChange('quizFinalMessage', e.currentTarget.textContent || '')}
              >
                {finalMessage}
              </div>
              <p className="text-xs sm:text-sm uppercase tracking-[0.35em] text-white/70">Skorun: {score}</p>
              <button
                onClick={handleStart}
                className={`rounded-full bg-white px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.4em] text-purple-600 transition hover:scale-105 break-words ${isEditable ? 'hover:bg-gray-100 cursor-text' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleContentChange('quizReplay', e.currentTarget.textContent || '')}
              >
                {replayLabel}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
