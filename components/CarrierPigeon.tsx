import React, { useState, useEffect } from 'react';
import { Bird, X, Send, Loader2, Sparkles } from 'lucide-react';
import { generateRoyalMessage } from '../services/geminiService';

interface CarrierPigeonProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CarrierPigeon: React.FC<CarrierPigeonProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'compose' | 'flying' | 'delivered'>('compose');
  const [message, setMessage] = useState('');
  const [sender, setSender] = useState<'King' | 'Queen'>('King');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep('compose');
      setMessage('');
    }
  }, [isOpen]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    const recipient = sender === 'King' ? 'Queen' : 'King';
    const generatedText = await generateRoyalMessage(sender, recipient);
    setMessage(generatedText);
    setIsGenerating(false);
  };

  const handleSend = () => {
    setStep('flying');
    setTimeout(() => {
      setStep('delivered');
    }, 4000); // Matches the CSS animation duration
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden">
        {/* Overlay */}
        <div className="absolute inset-0 bg-charcoal/70 backdrop-blur-sm" onClick={onClose}></div>

        {/* Flying Bird Animation Layer */}
        {step === 'flying' && (
            <div className="absolute top-1/2 left-0 z-[210] animate-fly-right pointer-events-none">
                <div className="relative">
                    <Bird className="w-24 h-24 text-white drop-shadow-lg" />
                    <div className="absolute top-16 left-8 bg-parchment w-8 h-6 rounded border border-gold rotate-12 shadow-md"></div>
                </div>
            </div>
        )}

        {/* Modal Content */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className={`bg-white w-full max-w-lg rounded-xl shadow-2xl pointer-events-auto transition-all duration-500 ${step === 'flying' ? 'scale-90 opacity-0' : 'scale-100 opacity-100'}`}>
                
                {step === 'compose' && (
                    <div className="p-6">
                         <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                            <div className="flex items-center gap-2">
                                <Bird className="text-king w-6 h-6" />
                                <h3 className="font-serif text-xl font-bold text-charcoal">Royal Carrier Pigeon</h3>
                            </div>
                            <button onClick={onClose} className="text-gray-400 hover:text-charcoal"><X/></button>
                        </div>

                        <div className="flex gap-4 mb-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" checked={sender === 'King'} onChange={() => setSender('King')} className="accent-king" />
                                <span className="font-serif text-sm">From King</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" checked={sender === 'Queen'} onChange={() => setSender('Queen')} className="accent-queen" />
                                <span className="font-serif text-sm">From Queen</span>
                            </label>
                        </div>

                        <div className="relative mb-4">
                             <textarea 
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Write your royal decree of affection here..."
                                className="w-full h-32 p-4 bg-parchment rounded-lg border border-gold/50 font-serif text-charcoal focus:ring-2 focus:ring-gold outline-none resize-none"
                             />
                             <button 
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                className="absolute bottom-3 right-3 text-xs bg-white/80 hover:bg-white text-goldDark border border-gold/30 px-2 py-1 rounded-md flex items-center gap-1 transition-colors"
                             >
                                {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                AI Scribe
                             </button>
                        </div>

                        <button 
                            onClick={handleSend}
                            disabled={!message.trim()}
                            className="w-full bg-king hover:bg-blue-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-4 h-4" />
                            Dispatch Pigeon
                        </button>
                    </div>
                )}

                {step === 'delivered' && (
                    <div className="p-10 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                            <Bird className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-charcoal mb-2">Message Delivered!</h3>
                        <p className="text-gray-500 mb-6">Your royal decree has been sent across the kingdom.</p>
                        <button onClick={onClose} className="text-king font-bold hover:underline">Close</button>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};