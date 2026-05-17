import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Upload, X } from 'lucide-react';
import { StarField } from '../shared/StarField';
import { PolaroidCard } from '../shared/PolaroidCard';
import { fileToDataUrl, validateImageFile } from '../../utils/imageProcessing';

export const GiftModeForm: React.FC = () => {
  const [name, setName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [nickname, setNickname] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');
  const [relationship, setRelationship] = useState('');
  const [rewriteMessage, setRewriteMessage] = useState(true);
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [voiceData, setVoiceData] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<BlobPart[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isLoadingPhoto, setIsLoadingPhoto] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();

  const canSubmit = Boolean(name.trim() && senderName.trim() && date && message.trim());

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoadingPhoto(true);
    setPhotoError(null);

    try {
      // Validate file
      const validation = validateImageFile(file, 5);
      if (!validation.valid) {
        setPhotoError(validation.error || 'Invalid image file');
        setIsLoadingPhoto(false);
        return;
      }

      // Convert to data URL
      const dataUrl = await fileToDataUrl(file);
      setPhotoData(dataUrl);
    } catch (error) {
      setPhotoError('Failed to load image. Please try another file.');
      console.error('Photo upload error:', error);
    } finally {
      setIsLoadingPhoto(false);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoData(null);
    setPhotoError(null);
  };

  const submitForm = () => {
    if (isSubmitting) return;

    if (!canSubmit) {
      setSubmitError('Please fill in Their Name, Your Name, Birth Date, and Personal Message.');
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    navigate('/gift/result', {
      state: {
        name: name.trim(),
        senderName: senderName.trim(),
        nickname: nickname.trim(),
        date,
        message: message.trim(),
        relationship: relationship.trim(),
        rewriteMessage,
        photoData,
        voiceData,
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recordedChunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;

      mr.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) {
          recordedChunksRef.current.push(ev.data);
        }
      };

      mr.onstop = async () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
        const file = new File([blob], 'voice.webm', { type: blob.type });
        try {
          const dataUrl = await fileToDataUrl(file);
          setVoiceData(dataUrl);
        } catch (err) {
          console.error('Failed to encode recorded audio', err);
        }
        // stop tracks
        stream.getTracks().forEach((t) => t.stop());
      };

      mr.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Recording failed or permission denied', err);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    try {
      mediaRecorderRef.current?.stop();
      mediaRecorderRef.current = null;
    } catch (e) {
      // ignore
    }
  };

  const handleVoiceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      // optional: limit to 5MB
      if (file.size > 5 * 1024 * 1024) {
        alert('Voice note must be smaller than 5MB');
        return;
      }
      const dataUrl = await fileToDataUrl(file);
      setVoiceData(dataUrl);
    } catch (err) {
      console.error('Failed to load audio', err);
    }
  };

  const removeVoice = () => {
    setVoiceData(null);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-20">
      <StarField speed={0.1} starCount={150} />
      
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-8 left-8 text-cosmic-muted hover:text-cosmic-glow transition-colors font-body tracking-widest uppercase text-sm"
        onClick={() => navigate('/')}
      >
        ← Return
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full max-w-lg bg-black/40 p-8 md:p-12 rounded-3xl border border-white/10 backdrop-blur-md"
      >
        <h2 className="text-3xl md:text-4xl text-cosmic-text font-heading text-center mb-2 text-glow">
          Create a Universe
        </h2>
        <p className="text-center text-cosmic-muted mb-10 text-sm tracking-wide">
          Craft a deeply personal cosmic experience for someone special.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          <div className="relative">
            <input
              type="text"
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full bg-transparent border-b border-cosmic-muted/50 py-3 px-1 text-xl text-cosmic-text focus:outline-none focus:border-cosmic-glow transition-colors peer"
              placeholder=" "
            />
            <label 
              htmlFor="name"
              className="absolute left-1 top-3 text-cosmic-muted font-body text-lg transition-all peer-focus:-top-6 peer-focus:text-sm peer-focus:text-cosmic-glow peer-valid:-top-6 peer-valid:text-sm"
            >
              Their Name
            </label>
          </div>

          <div className="relative">
            <input
              type="text"
              id="senderName"
              required
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="block w-full bg-transparent border-b border-cosmic-muted/50 py-3 px-1 text-xl text-cosmic-text focus:outline-none focus:border-cosmic-glow transition-colors peer"
              placeholder=" "
            />
            <label
              htmlFor="senderName"
              className="absolute left-1 top-3 text-cosmic-muted font-body text-lg transition-all peer-focus:-top-6 peer-focus:text-sm peer-focus:text-cosmic-glow peer-valid:-top-6 peer-valid:text-sm"
            >
              Your Name
            </label>
          </div>

          <div className="relative">
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="block w-full bg-transparent border-b border-cosmic-muted/50 py-3 px-1 text-xl text-cosmic-text focus:outline-none focus:border-cosmic-glow transition-colors peer"
              placeholder=" "
            />
            <label 
              htmlFor="nickname"
              className="absolute left-1 top-3 text-cosmic-muted font-body text-lg transition-all peer-focus:-top-6 peer-focus:text-sm peer-focus:text-cosmic-glow peer-valid:-top-6 peer-valid:text-sm"
            >
              Their Nickname (Optional)
            </label>
          </div>

          {/* Photo Upload Section */}
          <div className="space-y-3 pt-4">
            <label htmlFor="photo" className="text-cosmic-muted font-body text-sm transition-all tracking-wide uppercase">
              Add a Memory Photo (Optional)
            </label>
            
            {!photoData ? (
              <div className="relative">
                <input
                  type="file"
                  id="photo"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handlePhotoUpload}
                  disabled={isLoadingPhoto}
                  className="hidden"
                />
                <label 
                  htmlFor="photo"
                  className="block w-full px-4 py-4 rounded-xl border-2 border-dashed border-cosmic-muted/30 hover:border-cosmic-glow/50 transition-colors cursor-pointer text-center"
                >
                  <Upload className="w-6 h-6 mx-auto mb-2 text-cosmic-muted" />
                  <p className="text-cosmic-muted text-sm">
                    {isLoadingPhoto ? 'Processing...' : 'Click to upload JPG or PNG'}
                  </p>
                  <p className="text-cosmic-muted/50 text-xs mt-1">Max 5MB</p>
                </label>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative">
                  <PolaroidCard
                    src={photoData}
                    alt="Memory photo preview"
                    caption="Memory kept"
                    imageClassName="h-56"
                  />
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="absolute top-3 right-3 p-2 rounded-lg bg-black/60 hover:bg-black/80 transition-colors"
                    title="Remove photo"
                  >
                    <X className="w-4 h-4 text-cosmic-glow" />
                  </button>
                </div>
                <p className="text-cosmic-muted text-sm">Photo ready to be used in the puzzle experience.</p>
              </div>
            )}

            {photoError && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-cosmic-accent-2 text-sm bg-cosmic-accent-2/10 p-3 rounded-lg"
              >
                {photoError}
              </motion.p>
            )}
          </div>

          {/* Voice Note Section */}
          <div className="space-y-3 pt-4">
            <label className="text-cosmic-muted font-body text-sm transition-all tracking-wide uppercase">
              Add a Voice Note (Optional)
            </label>

            {!voiceData ? (
              <div className="flex flex-col md:flex-row gap-3 items-center">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => (isRecording ? stopRecording() : startRecording())}
                    className={`px-4 py-2 rounded-lg font-medium ${isRecording ? 'bg-red-600 text-white' : 'bg-white/5 text-cosmic-glow'}`}
                  >
                    {isRecording ? 'Stop' : 'Record'}
                  </button>

                  <label className="block">
                    <input type="file" accept="audio/*" onChange={handleVoiceUpload} className="hidden" />
                    <span className="px-4 py-2 rounded-lg bg-white/5 text-cosmic-glow cursor-pointer">Upload</span>
                  </label>
                </div>
                <p className="text-cosmic-muted text-sm">Max 5MB · Optional short message</p>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <audio controls src={voiceData} className="w-64" />
                <button type="button" onClick={removeVoice} className="px-3 py-2 rounded bg-white/5">Remove</button>
              </div>
            )}
          </div>

          <div className="relative">
            <input
              type="date"
              id="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="block w-full bg-transparent border-b border-cosmic-muted/50 py-3 px-1 text-xl text-cosmic-text focus:outline-none focus:border-cosmic-glow transition-colors peer"
            />
            <label 
              htmlFor="date"
              className="absolute left-1 -top-6 text-sm text-cosmic-muted font-body transition-all peer-focus:text-cosmic-glow"
            >
              Their Birth Date
            </label>
          </div>

          <div className="relative">
            <input
              type="text"
              id="relationship"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="block w-full bg-transparent border-b border-cosmic-muted/50 py-3 px-1 text-lg text-cosmic-text focus:outline-none focus:border-cosmic-glow transition-colors peer"
              placeholder=" "
            />
            <label 
              htmlFor="relationship"
              className="absolute left-1 top-3 text-cosmic-muted font-body text-lg transition-all peer-focus:-top-6 peer-focus:text-sm peer-focus:text-cosmic-glow peer-valid:-top-6 peer-valid:text-sm"
            >
              Your Relationship (Optional)
            </label>
            <span className="absolute right-1 top-4 text-xs text-cosmic-muted/50">e.g., Best Friend, Sister</span>
          </div>

          <div className="relative mt-12">
            <textarea
              id="message"
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="block w-full bg-white/5 border border-cosmic-muted/30 rounded-xl p-4 text-lg text-cosmic-text focus:outline-none focus:border-cosmic-glow transition-colors resize-none placeholder-transparent peer"
              placeholder=" "
            />
            <label 
              htmlFor="message"
              className="absolute left-4 top-4 text-cosmic-muted font-body text-lg transition-all peer-focus:-top-8 peer-focus:left-1 peer-focus:text-sm peer-focus:text-cosmic-glow peer-valid:-top-8 peer-valid:left-1 peer-valid:text-sm"
            >
              Your Personal Message
            </label>
          </div>

          <div className="flex items-center space-x-3 text-left">
            <input
              type="checkbox"
              id="rewriteMessage"
              checked={rewriteMessage}
              onChange={(e) => setRewriteMessage(e.target.checked)}
              className="w-5 h-5 accent-cosmic-accent-1 cursor-pointer"
            />
            <label htmlFor="rewriteMessage" className="text-cosmic-muted text-sm cursor-pointer select-none">
              Let AI seamlessly weave this message into the letter (uncheck to include it exactly as written at the end)
            </label>
          </div>

          <div className="pt-6 text-center">
            <button
              type="button"
              onClick={submitForm}
              disabled={!canSubmit || isSubmitting}
              className="relative z-10 w-full py-4 rounded-xl bg-cosmic-text text-cosmic-bg font-heading text-xl tracking-widest hover:bg-cosmic-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(245,243,255,0.1)] hover:shadow-[0_0_30px_rgba(196,181,253,0.3)]"
            >
              {isSubmitting ? 'Generating...' : 'Generate Universe'}
            </button>
            {submitError && (
              <p className="mt-3 text-sm text-cosmic-accent-2">{submitError}</p>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};
