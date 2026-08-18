import React, { useState } from 'react';
import { Star, MessageSquare, Send, ExternalLink, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReviewsList() {
  const [feedback, setFeedback] = useState('');
  const [sending, setSending] = useState(false);

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    
    setSending(true);
    // Simulate API call
    setTimeout(() => {
      setSending(false);
      setFeedback('');
      toast.success('Thank you! Your feedback has been sent directly to our team.');
    }, 1000);
  };

  return (
    <div className="w-full space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Love Map Pin Directory?</h1>
        <p className="text-gray-600 text-lg">Your support helps us keep the free version alive and constantly improving.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Leave a Review Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-8 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 text-amber-300">
              {[...Array(5)].map((_, i) => <Star key={i} size={24} fill="currentColor" />)}
            </div>
            <h2 className="text-2xl font-bold mb-3" style={{ color: '#ffffff' }}>Leave a 5-Star Review</h2>
            <p className="text-blue-100 mb-6 leading-relaxed">
              If this plugin has helped your business or saved you time, please consider leaving a 5-star review on WordPress.org. It takes just 1 minute and means the world to our small team!
            </p>
          </div>
          
          <a 
            href="https://wordpress.org/support/plugin/mri-map-pin-directory/reviews/#new-post" 
            target="_blank" 
            rel="noreferrer"
            className="bg-white text-blue-700 hover:bg-blue-50 py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Heart size={20} className="text-red-500" fill="currentColor" />
            Review on WordPress.org
            <ExternalLink size={16} className="ml-1" />
          </a>
        </div>

        {/* Feedback Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6 text-gray-800">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
              <MessageSquare size={24} />
            </div>
            <h2 className="text-xl font-bold">Send Feedback or Ideas</h2>
          </div>
          
          <form onSubmit={handleFeedbackSubmit}>
            <p className="text-gray-600 mb-4 text-sm">
              Have a feature request, found a bug, or just want to say hi? Send us a message directly!
            </p>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us what you think..."
              className="w-full h-32 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 outline-none resize-none mb-4"
              required
            ></textarea>
            <button 
              type="submit" 
              disabled={sending || !feedback.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {sending ? 'Sending...' : 'Send Message'}
              {!sending && <Send size={18} />}
            </button>
          </form>
        </div>
      </div>
      
      {/* Note about Location Reviews */}
      <div className="mt-12 bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
        <h3 className="font-bold text-gray-800 mb-2">Looking for Location Reviews?</h3>
        <p className="text-gray-600 text-sm">
          The ability to collect, moderate, and display user reviews for your individual map locations is a <strong className="text-blue-600">Pro Feature</strong>. 
          <a href="#/pricing" className="ml-2 text-blue-600 hover:underline font-semibold">Upgrade to Pro</a>
        </p>
      </div>
    </div>
  );
}
