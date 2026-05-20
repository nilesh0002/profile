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
  
  const [activeTab, setActiveTab] = useState('write'); // 'write' or 'preview'
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
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setStatus({
        submitting: false,
        success: false,
        error: true,
        message: 'Please fill in all required fields before submitting.'
      });
      return;
    }

    setStatus({ submitting: true, success: false, error: false, message: '' });

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    // Simulation fallback if credentials aren't configured yet
    if (!serviceId || !templateId || !publicKey) {
      console.warn("EmailJS credentials not found. Running in development simulation mode.");
      setTimeout(() => {
        setStatus({
          submitting: false,
          success: true,
          error: false,
          message: "Issue successfully created (Simulated Mode)!"
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
        setActiveTab('write');
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
          message: "New issue successfully created! I will get back to you soon."
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
        setActiveTab('write');
      } else {
        throw new Error('EmailJS response was not OK');
      }
    } catch (err) {
      console.error('EmailJS Error:', err);
      setStatus({
        submitting: false,
        success: false,
        error: true,
        message: "Failed to create issue. Please check your credentials or try again."
      });
    }
  };

  return (
    <div className="gh-content" style={{ maxWidth: '1012px', margin: '0 auto', padding: '0 8px' }}>
      {/* GitHub breadcrumb / issue page header */}
      <div style={{ borderBottom: '1px solid var(--gh-border)', paddingBottom: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', color: 'var(--gh-text-primary)' }}>
          <i className="fas fa-exclamation-circle" style={{ color: '#3fb950' }}></i>
          <span style={{ fontWeight: '400' }}>nilesh0002</span>
          <span style={{ color: 'var(--gh-text-secondary)' }}>/</span>
          <span style={{ fontWeight: '600', color: 'var(--gh-link)' }}>portfolio</span>
          <span style={{ color: 'var(--gh-text-secondary)' }}>/</span>
          <span style={{ fontWeight: '400' }}>Issues</span>
          <span style={{ color: 'var(--gh-text-secondary)' }}>/</span>
          <span style={{ fontWeight: '600' }}>New Issue</span>
        </div>
      </div>

      {/* GitHub Issue Grid */}
      <div className="contact-layout" style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '24px', margin: '0' }}>
        
        {/* Form Container (Left 75%) */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          {/* Avatar Icon */}
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--gh-border)', overflow: 'hidden', flexShrink: 0 }} className="mobile-hide">
            <img src="/image/profile.jpg" alt="Guest User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          {/* Chat/Issue Form Bubble */}
          <div className="issue-bubble" style={{
            position: 'relative',
            backgroundColor: 'var(--gh-panel-bg)',
            border: '1px solid var(--gh-border)',
            borderRadius: '6px',
            flexGrow: 1,
            minWidth: 0
          }}>
            {/* Header Tabs bar */}
            <div style={{
              display: 'flex',
              backgroundColor: 'var(--gh-panel-header)',
              borderBottom: '1px solid var(--gh-border)',
              padding: '8px 16px 0',
              borderTopLeftRadius: '6px',
              borderTopRightRadius: '6px',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              {/* Tab selectors */}
              <div style={{ display: 'flex', gap: '4px' }}>
                <button 
                  onClick={() => setActiveTab('write')}
                  style={{
                    backgroundColor: activeTab === 'write' ? 'var(--gh-bg)' : 'transparent',
                    border: '1px solid transparent',
                    borderBottomColor: activeTab === 'write' ? 'transparent' : 'var(--gh-border)',
                    borderTopLeftRadius: '6px',
                    borderTopRightRadius: '6px',
                    color: 'var(--gh-text-primary)',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: activeTab === 'write' ? '600' : '400',
                    cursor: 'pointer',
                    transform: 'translateY(1px)',
                    zIndex: 1
                  }}
                >
                  Write
                </button>
                <button 
                  onClick={() => setActiveTab('preview')}
                  style={{
                    backgroundColor: activeTab === 'preview' ? 'var(--gh-bg)' : 'transparent',
                    border: '1px solid transparent',
                    borderBottomColor: activeTab === 'preview' ? 'transparent' : 'var(--gh-border)',
                    borderTopLeftRadius: '6px',
                    borderTopRightRadius: '6px',
                    color: 'var(--gh-text-primary)',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: activeTab === 'preview' ? '600' : '400',
                    cursor: 'pointer',
                    transform: 'translateY(1px)',
                    zIndex: 1
                  }}
                >
                  Preview
                </button>
              </div>

              <span style={{ fontSize: '11px', color: 'var(--gh-text-secondary)', paddingBottom: '8px' }}>
                Markdown supported 
              </span>
            </div>

            {/* Bubble Body */}
            <div style={{ padding: '16px' }}>
              {status.success && (
                <div className="success-msg" style={{ display: 'block', marginBottom: '16px' }}>
                  <i className="fas fa-check-circle" style={{ marginRight: '6px' }}></i>
                  {status.message}
                </div>
              )}

              {status.error && (
                <div className="success-msg" style={{ display: 'block', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#f87171', marginBottom: '16px' }}>
                  <i className="fas fa-exclamation-circle" style={{ marginRight: '6px' }}></i>
                  {status.message}
                </div>
              )}

              {activeTab === 'write' ? (
                /* WRITE INTERFACE */
                <form ref={formRef} onSubmit={handleSubmit} id="contact-form">
                  {/* Name and Email Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }} className="form-row">
                    <div>
                      <input 
                        type="text" 
                        name="name" 
                        placeholder="Your Name" 
                        value={formData.name}
                        onChange={handleChange}
                        className="gh-input w-full"
                        style={{ padding: '8px 12px' }}
                        required 
                        disabled={status.submitting}
                      />
                    </div>
                    <div>
                      <input 
                        type="email" 
                        name="email" 
                        placeholder="Your Email" 
                        value={formData.email}
                        onChange={handleChange}
                        className="gh-input w-full"
                        style={{ padding: '8px 12px' }}
                        required 
                        disabled={status.submitting}
                      />
                    </div>
                  </div>

                  {/* Subject Input */}
                  <div style={{ marginBottom: '12px' }}>
                    <input 
                      type="text" 
                      name="subject" 
                      placeholder="Title / Subject" 
                      value={formData.subject}
                      onChange={handleChange}
                      className="gh-input w-full"
                      style={{ padding: '8px 12px', fontWeight: '500' }}
                      required 
                      disabled={status.submitting}
                    />
                  </div>

                  {/* Text Message Area */}
                  <div style={{ marginBottom: '16px' }}>
                    <textarea 
                      name="message" 
                      placeholder="Leave a message or describe your project opportunity..." 
                      value={formData.message}
                      onChange={handleChange}
                      className="gh-input w-full"
                      style={{ height: '180px', padding: '12px', fontFamily: 'monospace', fontSize: '13px' }}
                      required 
                      disabled={status.submitting}
                    ></textarea>
                  </div>

                  {/* Form Actions Footer */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <button 
                      type="submit" 
                      className="gh-btn gh-btn-primary" 
                      style={{ padding: '7px 20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                      disabled={status.submitting}
                    >
                      {status.submitting ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i> Submitting...
                        </>
                      ) : (
                        <>
                          Submit new issue
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* PREVIEW INTERFACE */
                <div style={{ minHeight: '265px', fontSize: '13px', lineHeight: '1.6' }}>
                  {formData.subject || formData.name || formData.message ? (
                    <div>
                      <div style={{ borderBottom: '1px solid var(--gh-border)', paddingBottom: '8px', marginBottom: '12px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--gh-text-secondary)' }}>PREVIEW</span>
                        <h2 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--gh-text-primary)', marginTop: '4px', border: 'none', margin: '0' }}>
                          {formData.subject || 'No Subject Provided'}
                        </h2>
                        <div style={{ fontSize: '12px', color: 'var(--gh-text-secondary)', marginTop: '4px' }}>
                          Opened by <span style={{ color: 'var(--gh-text-primary)', fontWeight: '600' }}>{formData.name || 'Anonymous Guest'}</span> &lt;{formData.email || 'no-email-given'}&gt;
                        </div>
                      </div>
                      <div className="markdown-body" style={{ whiteSpace: 'pre-wrap', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif' }}>
                        {formData.message || 'No description provided.'}
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: 'var(--gh-text-secondary)', textAlign: 'center', padding: '64px 0' }}>
                      <i className="fas fa-eye" style={{ fontSize: '24px', display: 'block', marginBottom: '12px' }}></i>
                      Nothing to preview. Go to the "Write" tab to fill in details.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* GitHub Issue Sidebar Settings (Right 25%) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="issue-sidebar">
          {/* Assignees */}
          <div style={{ borderBottom: '1px solid var(--gh-border)', paddingBottom: '12px', fontSize: '12px' }}>
            <div style={{ fontWeight: '600', color: 'var(--gh-text-secondary)', marginBottom: '8px' }}>Assignees</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', overflow: 'hidden' }}>
                <img src="/image/profile.jpg" alt="Nilesh Singh" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <span style={{ fontWeight: '600', color: 'var(--gh-text-primary)' }}>nilesh0002</span>
            </div>
          </div>

          {/* Labels */}
          <div style={{ borderBottom: '1px solid var(--gh-border)', paddingBottom: '12px', fontSize: '12px' }}>
            <div style={{ fontWeight: '600', color: 'var(--gh-text-secondary)', marginBottom: '8px' }}>Labels</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{
                backgroundColor: 'rgba(88, 166, 255, 0.15)',
                border: '1px solid rgba(88, 166, 255, 0.3)',
                color: 'var(--gh-link)',
                padding: '3px 8px',
                borderRadius: '2em',
                fontWeight: '600',
                fontSize: '10px',
                width: 'fit-content'
              }}>
                Opportunity
              </span>
              <span style={{
                backgroundColor: 'rgba(46, 160, 67, 0.15)',
                border: '1px solid rgba(46, 160, 67, 0.3)',
                color: '#3fb950',
                padding: '3px 8px',
                borderRadius: '2em',
                fontWeight: '600',
                fontSize: '10px',
                width: 'fit-content'
              }}>
                Message
              </span>
              <span style={{
                backgroundColor: 'rgba(163, 113, 247, 0.15)',
                border: '1px solid rgba(163, 113, 247, 0.3)',
                color: '#a371f7',
                padding: '3px 8px',
                borderRadius: '2em',
                fontWeight: '600',
                fontSize: '10px',
                width: 'fit-content'
              }}>
                Collaboration
              </span>
            </div>
          </div>

          {/* Projects */}
          <div style={{ borderBottom: '1px solid var(--gh-border)', paddingBottom: '12px', fontSize: '12px' }}>
            <div style={{ fontWeight: '600', color: 'var(--gh-text-secondary)', marginBottom: '8px' }}>Projects</div>
            <span style={{ color: 'var(--gh-text-primary)', fontWeight: '500' }}>
              <i className="fas fa-columns" style={{ color: 'var(--gh-text-secondary)', marginRight: '6px' }}></i>
              Portfolio Inbox
            </span>
          </div>

          {/* Milestone */}
          <div style={{ borderBottom: '1px solid var(--gh-border)', paddingBottom: '12px', fontSize: '12px' }}>
            <div style={{ fontWeight: '600', color: 'var(--gh-text-secondary)', marginBottom: '8px' }}>Milestone</div>
            <span style={{ color: 'var(--gh-text-primary)', fontWeight: '500' }}>
              <i className="fas fa-flag" style={{ color: 'var(--gh-text-secondary)', marginRight: '6px' }}></i>
              Hire Nilesh 💼
            </span>
          </div>

          {/* Notifications */}
          <div style={{ fontSize: '12px' }}>
            <div style={{ fontWeight: '600', color: 'var(--gh-text-secondary)', marginBottom: '8px' }}>Notifications</div>
            <button className="gh-btn w-full" style={{ fontSize: '11px', padding: '3px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }} disabled>
              <i className="fas fa-bell"></i> Subscribed
            </button>
            <p style={{ fontSize: '10px', color: 'var(--gh-text-secondary)', marginTop: '6px', lineHeight: '1.4' }}>
              You will receive a notification in your inbox when Nilesh replies.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
