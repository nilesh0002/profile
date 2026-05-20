import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const formRef = useRef();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: false,
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, success: false, error: false, message: '' });

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    // Fallback/Simulated Mode if credentials aren't configured yet
    if (!serviceId || !templateId || !publicKey) {
      console.warn("EmailJS credentials not found in environment variables. Running in development simulation mode.");
      setTimeout(() => {
        setStatus({
          submitting: false,
          success: true,
          error: false,
          message: "Message sent successfully (Simulated Mode)!"
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      }, 1500);
      return;
    }

    try {
      const result = await emailjs.sendForm(
        serviceId,
        templateId,
        formRef.current,
        publicKey
      );

      if (result.text === 'OK') {
        setStatus({
          submitting: false,
          success: true,
          error: false,
          message: "Message sent! I'll get back to you soon."
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error('EmailJS response was not OK');
      }
    } catch (err) {
      console.error('EmailJS Error:', err);
      setStatus({
        submitting: false,
        success: false,
        error: true,
        message: "Failed to send message. Please try again or email directly."
      });
    }
  };

  return (
    <div className="gh-content" style={{ maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{ borderBottom: '1px solid var(--gh-border)', paddingBottom: '16px', marginBottom: '28px' }}>
        <h1 className="f4" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fas fa-envelope"></i>Contact Me
        </h1>
        <p style={{ color: 'var(--gh-text-secondary)', fontSize: '13px', marginTop: '6px' }}>
          Have an opportunity, project idea, or just want to say hi? I'd love to hear from you.
        </p>
      </div>

      <div className="contact-layout">
        {/* Info Panel */}
        <div className="contact-info-card">
          <div>
            <div className="contact-info-title">Get in touch</div>
            <p style={{ fontSize: '12px', color: 'var(--gh-text-secondary)', marginTop: '6px', lineHeight: '1.6' }}>
              I'm actively looking for new opportunities. Whether it's a job offer, freelance project, or collaboration — my inbox is always open.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="contact-info-item">
              <i className="fas fa-envelope"></i>
              <a href="mailto:nilesh.singh0032@gmail.com">nilesh.singh0032@gmail.com</a>
            </div>
            <div className="contact-info-item">
              <i className="fab fa-linkedin"></i>
              <a href="https://www.linkedin.com/in/nileshsingh98" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
            <div className="contact-info-item">
              <i className="fab fa-github"></i>
              <a href="https://github.com/nilesh0002" target="_blank" rel="noopener noreferrer">github.com/nilesh0002</a>
            </div>
            <div className="contact-info-item">
              <i className="fab fa-twitter"></i>
              <a href="https://twitter.com/nil_esh__" target="_blank" rel="noopener noreferrer">@nil_esh__</a>
            </div>
            <div className="contact-info-item">
              <i className="fas fa-map-marker-alt"></i>
              <span>India</span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--gh-border)', paddingTop: '16px' }}>
            <div className="contact-info-title" style={{ marginBottom: '10px' }}>Download Resume</div>
            <a href="/Nilesh_Singh_Resume.pdf" download className="gh-btn w-full" style={{ textAlign: 'center', display: 'block' }}>
              <i className="fas fa-download" style={{ marginRight: '6px' }}></i>Nilesh_Singh_Resume.pdf
            </a>
          </div>
        </div>

        {/* Form Panel */}
        <div className="contact-form-card">
          <div className="contact-form-header">
            <i className="fas fa-paper-plane"></i> Send a Message
          </div>
          <div className="contact-form-body">
            {status.success && (
              <div className="success-msg" style={{ display: 'block' }}>
                <i className="fas fa-check-circle" style={{ marginRight: '6px' }}></i>
                {status.message}
              </div>
            )}
            
            {status.error && (
              <div className="success-msg" style={{ display: 'block', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#f87171' }}>
                <i className="fas fa-exclamation-circle" style={{ marginRight: '6px' }}></i>
                {status.message}
              </div>
            )}

            <form ref={formRef} onSubmit={handleSubmit} id="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="gh-label">Your Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    className="gh-input w-full" 
                    placeholder="John Doe" 
                    value={formData.name}
                    onChange={handleChange}
                    required 
                    disabled={status.submitting}
                  />
                </div>
                <div className="form-group">
                  <label className="gh-label">Your Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    className="gh-input w-full" 
                    placeholder="john@example.com" 
                    value={formData.email}
                    onChange={handleChange}
                    required 
                    disabled={status.submitting}
                  />
                </div>
              </div>

              <div className="form-group mb-3">
                <label className="gh-label">Subject</label>
                <input 
                  type="text" 
                  name="subject" 
                  className="gh-input w-full" 
                  placeholder="Job Opportunity / Collaboration / General" 
                  value={formData.subject}
                  onChange={handleChange}
                  required 
                  disabled={status.submitting}
                />
              </div>

              <div className="form-group mb-3">
                <label className="gh-label">Message</label>
                <textarea 
                  name="message" 
                  className="gh-input w-full" 
                  rows="6"
                  placeholder="Hi Nilesh, I'd like to discuss..." 
                  value={formData.message}
                  onChange={handleChange}
                  required 
                  disabled={status.submitting}
                ></textarea>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <span style={{ color: 'var(--gh-text-secondary)', fontSize: '12px' }}>
                  <i className="fas fa-lock" style={{ marginRight: '4px' }}></i>Goes directly to my inbox.
                </span>
                <button 
                  type="submit" 
                  className="gh-btn gh-btn-primary" 
                  style={{ padding: '8px 28px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  disabled={status.submitting}
                >
                  {status.submitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Sending...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i> Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
