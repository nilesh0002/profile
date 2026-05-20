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

    if (!serviceId || !templateId || !publicKey) {
      console.warn("EmailJS credentials not found in .env. Running in simulation mode.");
      setTimeout(() => {
        setStatus({
          submitting: false,
          success: true,
          error: false,
          message: "Message sent successfully! (Simulation Mode)"
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      }, 1500);
      return;
    }

    try {
      const templateParams = {
        name: formData.name,
        from_name: formData.name,
        email: formData.email,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        time: new Date().toLocaleString(),
        labels: 'Message'
      };

      const result = await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );

      if (result.text === 'OK') {
        setStatus({
          submitting: false,
          success: true,
          error: false,
          message: "Message sent successfully! Nilesh will get back to you soon."
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error('EmailJS response status not OK');
      }
    } catch (err) {
      console.error('EmailJS Error:', err);
      setStatus({
        submitting: false,
        success: false,
        error: true,
        message: `Failed to send message: ${err.message || 'Please check your internet connection.'}`
      });
    }
  };

  return (
    <div className="gh-content" style={{ maxWidth: '780px', margin: '0 auto', padding: '0 16px' }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px', 
          marginBottom: '10px' 
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #238636, #2ea043)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 12px rgba(46, 160, 67, 0.3)'
          }}>
            <i className="fas fa-envelope" style={{ color: '#fff', fontSize: '15px' }}></i>
          </div>
          <div>
            <h1 style={{ 
              fontSize: '22px', 
              fontWeight: '700', 
              color: 'var(--gh-text-primary)', 
              margin: 0,
              lineHeight: '1.2'
            }}>
              Get in Touch
            </h1>
            <p style={{ 
              fontSize: '13px', 
              color: 'var(--gh-text-secondary)', 
              margin: '2px 0 0 0' 
            }}>
              Have an opportunity or want to connect? Send me a message below.
            </p>
          </div>
        </div>
        <div style={{ 
          height: '1px', 
          background: 'linear-gradient(to right, var(--gh-border), transparent)',
          marginTop: '16px'
        }}></div>
      </div>

      {/* Status Alerts */}
      {status.success && (
        <div style={{ 
          marginBottom: '20px', 
          backgroundColor: 'rgba(46, 160, 67, 0.12)',
          border: '1px solid rgba(46, 160, 67, 0.35)',
          color: '#3fb950',
          padding: '14px 16px',
          borderRadius: '8px',
          fontSize: '13.5px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'fadeIn 0.3s ease'
        }}>
          <i className="fas fa-check-circle" style={{ fontSize: '18px', flexShrink: 0 }}></i>
          <span style={{ fontWeight: '600' }}>{status.message}</span>
        </div>
      )}

      {status.error && (
        <div style={{ 
          marginBottom: '20px', 
          backgroundColor: 'rgba(248, 81, 73, 0.12)', 
          border: '1px solid rgba(248, 81, 73, 0.35)',
          color: '#f85149', 
          padding: '14px 16px',
          borderRadius: '8px',
          fontSize: '13.5px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'fadeIn 0.3s ease'
        }}>
          <i className="fas fa-exclamation-triangle" style={{ fontSize: '18px', flexShrink: 0 }}></i>
          <span style={{ fontWeight: '600' }}>{status.message}</span>
        </div>
      )}

      {/* Contact Form Card */}
      <div style={{
        backgroundColor: 'var(--gh-panel-bg)',
        border: '1px solid var(--gh-border)',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
      }}>
        
        {/* Card Header */}
        <div style={{
          backgroundColor: 'var(--gh-panel-header)',
          borderBottom: '1px solid var(--gh-border)',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <i className="fas fa-paper-plane" style={{ color: 'var(--gh-text-secondary)', fontSize: '13px' }}></i>
          <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--gh-text-primary)' }}>
            Send a Message
          </span>
          <span style={{ 
            fontSize: '10px', 
            color: 'var(--gh-text-secondary)',
            backgroundColor: 'var(--gh-border)',
            padding: '2px 8px',
            borderRadius: '10px',
            marginLeft: 'auto'
          }}>
            All fields required
          </span>
        </div>

        {/* Form Body */}
        <form ref={formRef} onSubmit={handleSubmit} style={{ padding: '20px' }}>
          
          {/* Name & Email Row */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '14px', 
            marginBottom: '14px' 
          }}>
            <div>
              <label style={{ 
                display: 'block',
                fontSize: '12px', 
                fontWeight: '600',
                color: 'var(--gh-text-secondary)',
                marginBottom: '6px'
              }}>
                <i className="fas fa-user" style={{ marginRight: '5px', fontSize: '10px' }}></i>
                Your Name
              </label>
              <input 
                type="text" 
                name="name" 
                placeholder="e.g. John Doe" 
                value={formData.name}
                onChange={handleChange}
                className="gh-input w-full"
                style={{ 
                  padding: '10px 12px', 
                  fontSize: '13px',
                  borderRadius: '6px'
                }}
                required 
                disabled={status.submitting}
              />
            </div>
            <div>
              <label style={{ 
                display: 'block',
                fontSize: '12px', 
                fontWeight: '600',
                color: 'var(--gh-text-secondary)',
                marginBottom: '6px'
              }}>
                <i className="fas fa-at" style={{ marginRight: '5px', fontSize: '10px' }}></i>
                Your Email
              </label>
              <input 
                type="email" 
                name="email" 
                placeholder="e.g. john@company.com" 
                value={formData.email}
                onChange={handleChange}
                className="gh-input w-full"
                style={{ 
                  padding: '10px 12px', 
                  fontSize: '13px',
                  borderRadius: '6px'
                }}
                required 
                disabled={status.submitting}
              />
            </div>
          </div>

          {/* Subject */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ 
              display: 'block',
              fontSize: '12px', 
              fontWeight: '600',
              color: 'var(--gh-text-secondary)',
              marginBottom: '6px'
            }}>
              <i className="fas fa-tag" style={{ marginRight: '5px', fontSize: '10px' }}></i>
              Subject
            </label>
            <input 
              type="text" 
              name="subject" 
              placeholder="e.g. Job Opportunity at Google" 
              value={formData.subject}
              onChange={handleChange}
              className="gh-input w-full"
              style={{ 
                padding: '10px 12px', 
                fontSize: '13px', 
                fontWeight: '500',
                borderRadius: '6px'
              }}
              required 
              disabled={status.submitting}
            />
          </div>

          {/* Message */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block',
              fontSize: '12px', 
              fontWeight: '600',
              color: 'var(--gh-text-secondary)',
              marginBottom: '6px'
            }}>
              <i className="fas fa-comment-dots" style={{ marginRight: '5px', fontSize: '10px' }}></i>
              Message
            </label>
            <textarea 
              name="message" 
              placeholder="Write your message here..." 
              value={formData.message}
              onChange={handleChange}
              className="gh-input w-full"
              style={{ 
                height: '160px', 
                padding: '12px', 
                fontSize: '13px',
                borderRadius: '6px',
                resize: 'vertical',
                lineHeight: '1.6'
              }}
              required 
              disabled={status.submitting}
            ></textarea>
          </div>

          {/* Submit Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '11px', color: 'var(--gh-text-secondary)' }}>
              <i className="fas fa-lock" style={{ marginRight: '4px', fontSize: '9px' }}></i>
              Secured with EmailJS
            </span>
            <button 
              type="submit" 
              className="gh-btn gh-btn-primary" 
              style={{ 
                padding: '9px 24px', 
                fontSize: '13px', 
                fontWeight: '600',
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                borderRadius: '6px',
                transition: 'all 0.2s ease'
              }}
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

      {/* Quick Info Footer */}
      <div style={{ 
        marginTop: '24px', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '12px' 
      }}>
        <div style={{
          backgroundColor: 'var(--gh-panel-bg)',
          border: '1px solid var(--gh-border)',
          borderRadius: '8px',
          padding: '14px 16px',
          textAlign: 'center',
          transition: 'border-color 0.2s ease'
        }}>
          <i className="fas fa-bolt" style={{ color: '#f0883e', fontSize: '18px', marginBottom: '6px', display: 'block' }}></i>
          <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--gh-text-primary)' }}>Fast Response</div>
          <div style={{ fontSize: '11px', color: 'var(--gh-text-secondary)', marginTop: '2px' }}>Usually within 24hrs</div>
        </div>
        <div style={{
          backgroundColor: 'var(--gh-panel-bg)',
          border: '1px solid var(--gh-border)',
          borderRadius: '8px',
          padding: '14px 16px',
          textAlign: 'center',
          transition: 'border-color 0.2s ease'
        }}>
          <i className="fas fa-briefcase" style={{ color: '#a371f7', fontSize: '18px', marginBottom: '6px', display: 'block' }}></i>
          <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--gh-text-primary)' }}>Open to Work</div>
          <div style={{ fontSize: '11px', color: 'var(--gh-text-secondary)', marginTop: '2px' }}>Graduating 2027</div>
        </div>
        <div style={{
          backgroundColor: 'var(--gh-panel-bg)',
          border: '1px solid var(--gh-border)',
          borderRadius: '8px',
          padding: '14px 16px',
          textAlign: 'center',
          transition: 'border-color 0.2s ease'
        }}>
          <i className="fas fa-shield-alt" style={{ color: '#3fb950', fontSize: '18px', marginBottom: '6px', display: 'block' }}></i>
          <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--gh-text-primary)' }}>100% Private</div>
          <div style={{ fontSize: '11px', color: 'var(--gh-text-secondary)', marginTop: '2px' }}>Direct to inbox</div>
        </div>
      </div>

    </div>
  );
};

export default Contact;
