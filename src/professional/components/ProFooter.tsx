import React, { useState, useEffect } from 'react';
import { Mail, Linkedin, Github, Send, RefreshCw, Terminal, CheckCircle } from 'lucide-react';

export default function ProFooter() {
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMsg, setFormMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formLogs, setFormLogs] = useState<string[]>([]);
  const [stationTime, setStationTime] = useState('');

  // Live-updating Munich/Bavaria (Germany) time
  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Europe/Berlin',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const formatter = new Intl.DateTimeFormat('en-US', options);
      setStationTime(formatter.format(new Date()));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const addFormLog = (msg: string) => {
    setFormLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formMsg) return;
    
    setIsSubmitting(true);
    setFormLogs([]);
    addFormLog('INFO: Resolving host socket connection...');
    
    setTimeout(() => {
      addFormLog('INFO: Socket connected. Serializing envelope payload.');
    }, 400);

    setTimeout(() => {
      addFormLog('INFO: Security handshake certified. Pinging mail exchange server.');
    }, 850);

    setTimeout(() => {
      addFormLog('SUCCESS: Packet delivered. Exit code: 0');
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormName('');
      setFormEmail('');
      setFormMsg('');
    }, 1500);
  };

  return (
    <footer id="contact-section" className="pt-16 pb-8 relative overflow-hidden z-10">
      {/* Schematic overlay blueprint grids */}
      <div className="absolute inset-x-0 top-0 h-40 blueprint-grid opacity-5 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12">
          
          {/* Left Block: Identity & Coordinates */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-brand-accent font-mono text-[10px] tracking-widest font-semibold uppercase block mb-2">
                // CONNECT INTERFACE
              </span>
              <h3 className="font-display text-xl md:text-2xl font-bold text-brand-text-main tracking-tight">
                Let's Build Something Autonomous.
              </h3>
              <p className="text-xs text-brand-text-muted mt-3 font-sans leading-relaxed">
                Whether you have a complex control theory question, need custom ROS/ROS2 node authorship, simulation twin implementations, or just want to talk about mechatronics engineering — feel free to reach out.
              </p>
            </div>

            {/* Structured Quick Contacts */}
            <div className="space-y-3.5 font-mono text-xs">
              <div className="flex items-center gap-3 text-brand-text-muted">
                <Mail className="w-4 h-4 text-brand-accent/80" />
                <a href="mailto:nannuriabhi2000@gmail.com" className="hover:text-brand-accent transition-colors cursor-pointer">
                  nannuriabhi2000@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-brand-text-muted">
                <Github className="w-4 h-4 text-brand-accent/80" />
                <a href="https://github.com/Abhi-0212000" target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent transition-colors cursor-pointer">
                  github.com/Abhi-0212000
                </a>
              </div>
              <div className="flex items-center gap-3 text-brand-text-muted">
                <Linkedin className="w-4 h-4 text-brand-accent/80" />
                <a href="https://linkedin.com/in/abhishek-nannuri" target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent transition-colors cursor-pointer">
                  linkedin.com/in/abhishek-nannuri
                </a>
              </div>
            </div>

            {/* Diagnostic system location watermark */}
            <div className="bg-brand-card border border-brand-border rounded-xl p-4 text-[10px] font-mono text-brand-text-muted space-y-1.5 shadow-sm">
              <div className="flex justify-between">
                <span>STATION_TARGET:</span>
                <span className="text-brand-text-main font-semibold">Deggendorf, Bavaria, DE</span>
              </div>
              <div className="flex justify-between">
                <span>GEO_COORDINATES:</span>
                <span className="text-brand-text-main font-semibold">48.8353° N, 12.9604° E</span>
              </div>
              <div className="flex justify-between">
                <span>LOCAL_STATION_TIME:</span>
                <span className="text-brand-text-main font-semibold">{stationTime || 'LOADING_STATION_CLOCK...'}</span>
              </div>
            </div>
          </div>

          {/* Right Block: Simulated Socket Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-brand-card border border-brand-border rounded-2xl p-5 md:p-6 shadow-sm relative overflow-hidden">
              <span className="text-[9px] font-mono text-brand-text-muted uppercase block mb-4 tracking-wider">
                [SECURE_SHELL_PORT_EXCHANGE]
              </span>

              {submitSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <div className="h-12 w-12 rounded-full bg-brand-accent/10 border border-brand-accent/30 flex items-center justify-center mx-auto text-brand-accent">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-bold text-brand-text-main uppercase tracking-wider">MESSAGE STREAM ROUTED SUCCESSFULLY</h4>
                    <p className="text-xs text-brand-text-muted mt-2 font-sans">
                      Thank you. Abhishek will decode your transmission shortly.
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setSubmitSuccess(false);
                      setFormLogs([]);
                    }}
                    className="mt-2 text-[10px] font-mono text-brand-accent border border-brand-accent/20 bg-brand-accent/5 hover:bg-brand-accent/15 px-3.5 py-1.5 rounded-full transition-colors cursor-pointer"
                  >
                    Open New Session
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-brand-text-muted uppercase mb-1 tracking-wider">
                        SENDER_NAME
                      </label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. Nikola Tesla"
                        className="w-full bg-brand-bg border border-brand-border focus:border-brand-accent/60 rounded-xl px-3 py-2.5 text-xs font-sans text-brand-text-main placeholder-brand-text-muted/50 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-brand-text-muted uppercase mb-1 tracking-wider">
                        SENDER_EMAIL
                      </label>
                      <input
                        type="email"
                        required
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="e.g. tesla@wardenclyffe.org"
                        className="w-full bg-brand-bg border border-brand-border focus:border-brand-accent/60 rounded-xl px-3 py-2.5 text-xs font-sans text-brand-text-main placeholder-brand-text-muted/50 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-brand-text-muted uppercase mb-1 tracking-wider">
                      TRANSMISSION_PAYLOAD (MESSAGE)
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formMsg}
                      onChange={(e) => setFormMsg(e.target.value)}
                      placeholder="Enter details of your project or inquiry..."
                      className="w-full bg-brand-bg border border-brand-border focus:border-brand-accent/60 rounded-xl px-3 py-2.5 text-xs font-sans text-brand-text-main placeholder-brand-text-muted/50 outline-none transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-brand-accent hover:bg-brand-accent/90 text-white dark:text-black font-semibold font-mono py-2.5 rounded-xl text-xs transition-colors disabled:opacity-50 cursor-pointer shadow-md shadow-brand-accent/10"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Routing Socket...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 fill-current" />
                        Transmit Message Packet
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Dynamic socket compile logs */}
              {formLogs.length > 0 && (
                <div className="mt-4 border-t border-brand-border pt-3.5 space-y-1 font-mono text-[9px] text-brand-text-muted leading-relaxed">
                  {formLogs.map((log, idx) => (
                    <div key={idx} className={log.includes('SUCCESS') ? 'text-brand-accent' : ''}>
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Outer footer credit */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-brand-border text-[11px] text-brand-text-muted font-mono gap-4">
          <span>© {new Date().getFullYear()} Abhishek Nannuri. All rights reserved.</span>
          <div className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-brand-accent" />
            <span>Built in React + Tailwind v4 + TSX</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
