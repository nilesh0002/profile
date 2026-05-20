import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const formRef = useRef();
  const textareaRef = useRef();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [activeTab, setActiveTab] = useState('write'); // 'write' or 'preview'
  const [selectedLabels, setSelectedLabels] = useState(['Message']); // Default active label
  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: false,
    message: ''
  });

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Toggle label selection
  const handleLabelToggle = (labelName) => {
    setSelectedLabels(prev => {
      if (prev.includes(labelName)) {
        // Keep at least one label selected
        if (prev.length === 1) return prev;
        return prev.filter(l => l !== labelName);
      } else {
        return [...prev, labelName];
      }
    });
  };

  // Markdown Toolbar helper to insert syntax at cursor
  const insertMarkdown = (syntax) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    const selected = text.substring(start, end);

    let replacement = '';
    switch (syntax) {
      case 'bold':
        replacement = `**${selected || 'bold text'}**`;
        break;
      case 'italic':
        replacement = `*${selected || 'italic text'}*`;
        break;
      case 'code':
        replacement = `\`${selected || 'code'}\``;
        break;
      case 'quote':
        replacement = `\n> ${selected || 'blockquote'}\n`;
        break;
      case 'link':
        replacement = `[${selected || 'link text'}](https://example.com)`;
        break;
      case 'list':
        replacement = `\n- ${selected || 'list item'}\n`;
        break;
      default:
        return;
    }

    const newText = before + replacement + after;
    setFormData(prev => ({ ...prev, message: newText }));

    // Refocus and place cursor after inserted text
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + replacement.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 50);
  };

  // Submit form handler
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

    // Build message body including the selected labels
    const labelsString = selectedLabels.join(', ');
    const submissionMessage = `${formData.message}\n\n---\n🏷️ Applied Labels: ${labelsString}`;

    // Simulation fallback if credentials aren't configured yet
    if (!serviceId || !templateId || !publicKey) {
      console.warn("EmailJS credentials not found in .env. Running in development simulation mode.");
      setTimeout(() => {
        setStatus({
          submitting: false,
          success: true,
          error: false,
          message: "New issue created successfully (Simulation Mode)!"
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
        setActiveTab('write');
      }, 1500);
      return;
    }

    try {
      // Create a temporary form element or send direct object parameters to EmailJS
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: submissionMessage,
        labels: labelsString
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
          message: "New issue opened successfully! Your email has been delivered to Nilesh."
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
        setActiveTab('write');
      } else {
        throw new Error('EmailJS response status not OK');
      }
    } catch (err) {
      console.error('EmailJS Error:', err);
      setStatus({
        submitting: false,
        success: false,
        error: true,
        message: `Failed to deliver email: ${err.message || 'Check your internet connection or .env configuration.'}`
      });
    }
  };

  // Safe client-side markdown formatter for preview tab
  const renderMarkdown = (text) => {
    if (!text) {
      return (
        <div style={{ color: 'var(--gh-text-secondary)', textAlign: 'center', padding: '40px 0' }}>
          <i className="fas fa-eye" style={{ fontSize: '24px', display: 'block', marginBottom: '12px' }}></i>
          Nothing to preview. Start typing in the description box first!
        </div>
      );
    }
    
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      let content = line;
      
      // Headings
      if (content.startsWith('### ')) {
        return (
          <h3 key={idx} style={{ 
            borderBottom: '1px solid var(--gh-border)', 
            paddingBottom: '6px', 
            margin: '18px 0 8px 0', 
            fontSize: '16px', 
            fontWeight: '600',
            color: 'var(--gh-text-primary)' 
          }}>
            {content.substring(4)}
          </h3>
        );
      }
      if (content.startsWith('## ')) {
        return (
          <h2 key={idx} style={{ 
            borderBottom: '1px solid var(--gh-border)', 
            paddingBottom: '8px', 
            margin: '22px 0 10px 0', 
            fontSize: '20px', 
            fontWeight: '600',
            color: 'var(--gh-text-primary)' 
          }}>
            {content.substring(3)}
          </h2>
        );
      }
      if (content.startsWith('# ')) {
        return (
          <h1 key={idx} style={{ 
            borderBottom: '1px solid var(--gh-border)', 
            paddingBottom: '10px', 
            margin: '26px 0 12px 0', 
            fontSize: '24px', 
            fontWeight: '600',
            color: 'var(--gh-text-primary)' 
          }}>
            {content.substring(2)}
          </h1>
        );
      }
      
      // Blockquotes
      if (content.startsWith('> ')) {
        return (
          <blockquote key={idx} style={{ 
            borderLeft: '4px solid var(--gh-border)', 
            paddingLeft: '12px', 
            margin: '12px 0', 
            color: 'var(--gh-text-secondary)', 
            fontStyle: 'italic' 
          }}>
            {parseInlineMarkdown(content.substring(2))}
          </blockquote>
        );
      }
      
      // Bullet list items
      if (content.startsWith('- ') || content.startsWith('* ')) {
        return (
          <ul key={idx} style={{ paddingLeft: '24px', margin: '4px 0' }}>
            <li style={{ listStyleType: 'disc', color: 'var(--gh-text-primary)' }}>
              {parseInlineMarkdown(content.substring(2))}
            </li>
          </ul>
        );
      }
      
      // Empty spaces
      if (content.trim() === '') {
        return <div key={idx} style={{ height: '8px' }}></div>;
      }
      
      // Standard lines
      return (
        <p key={idx} style={{ margin: '0 0 8px 0', fontSize: '13.5px', color: 'var(--gh-text-primary)' }}>
          {parseInlineMarkdown(content)}
        </p>
      );
    });
  };

  // Inline formatting helper (escape HTML & insert strong, code, and link tags)
  const parseInlineMarkdown = (text) => {
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.*?)`/g, '<code style="background-color: rgba(110, 118, 129, 0.2); padding: 2px 5px; border-radius: 6px; font-family: monospace; font-size: 12px; color: #ff7b72;">$1</code>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: var(--gh-link); text-decoration: none;">$1</a>');

    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div className="gh-content" style={{ maxWidth: '1012px', margin: '0 auto', padding: '0 8px' }}>
      
      {/* GitHub breadcrumb / issue page header */}
      <div style={{ borderBottom: '1px solid var(--gh-border)', paddingBottom: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', color: 'var(--gh-text-primary)' }}>
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
      <div className="contact-layout">
        
        {/* Form Container (Left Side) */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexGrow: 1, minWidth: 0 }}>
          
          {/* Avatar Icon (Standard Guest Icon) */}
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            border: '1px solid var(--gh-border)', 
            backgroundColor: '#161b22', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            flexShrink: 0,
            overflow: 'hidden'
          }} className="mobile-hide">
            <i className="fas fa-user-astronaut" style={{ color: 'var(--gh-text-secondary)', fontSize: '18px' }}></i>
          </div>

          {/* Chat/Issue Form Bubble */}
          <div className="issue-bubble" style={{
            position: 'relative',
            backgroundColor: 'var(--gh-panel-bg)',
            border: '1px solid var(--gh-border)',
            borderRadius: '6px',
            flexGrow: 1,
            minWidth: 0,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
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
                    zIndex: 1,
                    transition: '0.2s'
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
                    zIndex: 1,
                    transition: '0.2s'
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
              
              {/* Submission Alerts */}
              {status.success && (
                <div className="success-msg" style={{ 
                  display: 'block', 
                  marginBottom: '16px', 
                  backgroundColor: 'rgba(46, 160, 67, 0.15)',
                  border: '1px solid rgba(46, 160, 67, 0.4)',
                  color: '#3fb950',
                  padding: '12px',
                  borderRadius: '6px',
                  fontSize: '13.5px'
                }}>
                  <div style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fas fa-check-circle" style={{ fontSize: '16px' }}></i>
                    {status.message}
                  </div>
                  {!import.meta.env.VITE_EMAILJS_SERVICE_ID && (
                    <div style={{ 
                      marginTop: '10px', 
                      fontSize: '12px', 
                      color: 'var(--gh-text-secondary)', 
                      borderTop: '1px solid var(--gh-border)', 
                      paddingTop: '10px', 
                      lineHeight: '1.5' 
                    }}>
                      <strong style={{ color: 'var(--gh-text-primary)' }}>⚠️ Why didn't you receive an email?</strong>
                      <p style={{ marginTop: '4px' }}>
                        This portfolio is currently running in <strong>Simulation Mode</strong> because your local <code>.env</code> file does not contain EmailJS keys.
                      </p>
                      <p style={{ marginTop: '6px' }}>
                        To activate real emails direct to your inbox:
                      </p>
                      <ol style={{ paddingLeft: '20px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <li>Create a free account on <a href="https://www.emailjs.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gh-link)', fontWeight: '600' }}>EmailJS.com</a>.</li>
                        <li>Link your Gmail as an <strong>Email Service</strong>.</li>
                        <li>Create an <strong>Email Template</strong>.</li>
                        <li>Fill in the keys (Service ID, Template ID, Public Key) in your local <code>.env</code> file!</li>
                      </ol>
                    </div>
                  )}
                </div>
              )}

              {status.error && (
                <div className="success-msg" style={{ 
                  display: 'block', 
                  backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                  borderColor: 'rgba(239, 68, 68, 0.4)', 
                  color: '#f87171', 
                  padding: '12px',
                  borderRadius: '6px',
                  marginBottom: '16px',
                  fontSize: '13.5px'
                }}>
                  <div style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fas fa-exclamation-circle" style={{ fontSize: '16px' }}></i>
                    Error Submitting Issue
                  </div>
                  <p style={{ marginTop: '4px', fontSize: '12px', color: 'var(--gh-text-secondary)' }}>{status.message}</p>
                </div>
              )}

              {activeTab === 'write' ? (
                /* WRITE INTERFACE */
                <form ref={formRef} onSubmit={handleSubmit} id="contact-form">
                  
                  {/* Name and Email Row */}
                  <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <label className="gh-label" style={{ fontSize: '12px', color: 'var(--gh-text-secondary)' }}>Sender Name *</label>
                      <input 
                        type="text" 
                        name="name" 
                        placeholder="e.g. John Doe" 
                        value={formData.name}
                        onChange={handleChange}
                        className="gh-input w-full"
                        style={{ padding: '8px 12px', fontSize: '13px', marginTop: '4px' }}
                        required 
                        disabled={status.submitting}
                      />
                    </div>
                    <div>
                      <label className="gh-label" style={{ fontSize: '12px', color: 'var(--gh-text-secondary)' }}>Sender Email *</label>
                      <input 
                        type="email" 
                        name="email" 
                        placeholder="e.g. john@example.com" 
                        value={formData.email}
                        onChange={handleChange}
                        className="gh-input w-full"
                        style={{ padding: '8px 12px', fontSize: '13px', marginTop: '4px' }}
                        required 
                        disabled={status.submitting}
                      />
                    </div>
                  </div>

                  {/* Subject Input */}
                  <div style={{ marginBottom: '12px' }}>
                    <label className="gh-label" style={{ fontSize: '12px', color: 'var(--gh-text-secondary)' }}>Issue Title / Subject *</label>
                    <input 
                      type="text" 
                      name="subject" 
                      placeholder="Title of your message" 
                      value={formData.subject}
                      onChange={handleChange}
                      className="gh-input w-full"
                      style={{ padding: '8px 12px', fontSize: '13px', fontWeight: '500', marginTop: '4px' }}
                      required 
                      disabled={status.submitting}
                    />
                  </div>

                  {/* Markdown Toolbar */}
                  <div style={{ 
                    border: '1px solid var(--gh-border)', 
                    borderBottom: 'none',
                    borderTopLeftRadius: '6px', 
                    borderTopRightRadius: '6px', 
                    backgroundColor: 'var(--gh-panel-header)', 
                    padding: '6px 12px', 
                    display: 'flex', 
                    gap: '12px',
                    alignItems: 'center'
                  }}>
                    <button type="button" onClick={() => insertMarkdown('bold')} title="Bold Text" style={{ background: 'none', border: 'none', color: 'var(--gh-text-secondary)', cursor: 'pointer', fontSize: '13px', padding: '2px' }}><i className="fas fa-bold"></i></button>
                    <button type="button" onClick={() => insertMarkdown('italic')} title="Italic Text" style={{ background: 'none', border: 'none', color: 'var(--gh-text-secondary)', cursor: 'pointer', fontSize: '13px', padding: '2px' }}><i className="fas fa-italic"></i></button>
                    <button type="button" onClick={() => insertMarkdown('code')} title="Insert Code" style={{ background: 'none', border: 'none', color: 'var(--gh-text-secondary)', cursor: 'pointer', fontSize: '13px', padding: '2px' }}><i className="fas fa-code"></i></button>
                    <div style={{ width: '1px', height: '14px', backgroundColor: 'var(--gh-border)' }}></div>
                    <button type="button" onClick={() => insertMarkdown('quote')} title="Insert Blockquote" style={{ background: 'none', border: 'none', color: 'var(--gh-text-secondary)', cursor: 'pointer', fontSize: '13px', padding: '2px' }}><i className="fas fa-quote-right"></i></button>
                    <button type="button" onClick={() => insertMarkdown('link')} title="Insert Link" style={{ background: 'none', border: 'none', color: 'var(--gh-text-secondary)', cursor: 'pointer', fontSize: '13px', padding: '2px' }}><i className="fas fa-link"></i></button>
                    <button type="button" onClick={() => insertMarkdown('list')} title="Insert Bullet List" style={{ background: 'none', border: 'none', color: 'var(--gh-text-secondary)', cursor: 'pointer', fontSize: '13px', padding: '2px' }}><i className="fas fa-list-ul"></i></button>
                  </div>

                  {/* Text Message Area */}
                  <div style={{ marginBottom: '16px', position: 'relative' }}>
                    <textarea 
                      ref={textareaRef}
                      name="message" 
                      placeholder="Leave a message or describe your project opportunity... Use markdown commands (e.g. **bold**, `code`, or ### header)!" 
                      value={formData.message}
                      onChange={handleChange}
                      className="gh-input w-full"
                      style={{ 
                        height: '180px', 
                        padding: '12px', 
                        fontFamily: 'monospace', 
                        fontSize: '13px',
                        borderTopLeftRadius: '0',
                        borderTopRightRadius: '0',
                        borderTop: 'none',
                        resize: 'vertical'
                      }}
                      required 
                      disabled={status.submitting}
                    ></textarea>
                    
                    {/* Simulated Attachment Footer */}
                    <div style={{
                      backgroundColor: 'var(--gh-panel-header)',
                      border: '1px solid var(--gh-border)',
                      borderTop: 'none',
                      borderBottomLeftRadius: '6px',
                      borderBottomRightRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '11px',
                      color: 'var(--gh-text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <i className="fas fa-paperclip"></i>
                      <span>Attach files by dragging & dropping, selecting or pasting them (Simulated)</span>
                    </div>
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
                <div style={{ minHeight: '265px', fontSize: '13.5px', lineHeight: '1.6' }}>
                  <div style={{ borderBottom: '1px solid var(--gh-border)', paddingBottom: '10px', marginBottom: '16px' }}>
                    <span style={{ 
                      fontSize: '10px', 
                      backgroundColor: 'var(--gh-border)', 
                      color: 'var(--gh-text-secondary)', 
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: '600'
                    }}>
                      PREVIEW
                    </span>
                    <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--gh-text-primary)', marginTop: '8px', border: 'none', margin: '8px 0 0 0' }}>
                      {formData.subject || 'No Subject Provided'}
                    </h2>
                    <div style={{ fontSize: '12px', color: 'var(--gh-text-secondary)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      Opened by 
                      <span style={{ color: 'var(--gh-text-primary)', fontWeight: '600' }}>
                        {formData.name || 'Anonymous Guest'}
                      </span> 
                      {formData.email && <span style={{ fontFamily: 'monospace', color: 'var(--gh-text-secondary)' }}>&lt;{formData.email}&gt;</span>}
                      
                      {/* Active label previews */}
                      <span style={{ display: 'inline-flex', gap: '4px', marginLeft: '6px' }}>
                        {selectedLabels.map(label => {
                          let color = 'var(--gh-link)';
                          let bg = 'rgba(88, 166, 255, 0.1)';
                          let border = 'rgba(88, 166, 255, 0.2)';
                          if (label === 'Message') {
                            color = '#3fb950';
                            bg = 'rgba(46, 160, 67, 0.1)';
                            border = 'rgba(46, 160, 67, 0.2)';
                          } else if (label === 'Collaboration') {
                            color = '#a371f7';
                            bg = 'rgba(163, 113, 247, 0.1)';
                            border = 'rgba(163, 113, 247, 0.2)';
                          }
                          return (
                            <span key={label} style={{
                              backgroundColor: bg,
                              color: color,
                              border: `1px solid ${border}`,
                              padding: '1px 6px',
                              borderRadius: '2em',
                              fontSize: '9px',
                              fontWeight: '600'
                            }}>
                              {label}
                            </span>
                          );
                        })}
                      </span>
                    </div>
                  </div>
                  
                  {/* Markdown Body container */}
                  <div className="markdown-body" style={{ 
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
                    padding: '4px 0'
                  }}>
                    {renderMarkdown(formData.message)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* GitHub Issue Sidebar Settings (Right Side) */}
        <div className="issue-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '18px', width: '220px', flexShrink: 0 }}>
          
          {/* Assignees - REFACTORED to remove duplicates */}
          <div style={{ borderBottom: '1px solid var(--gh-border)', paddingBottom: '14px', fontSize: '12px' }}>
            <div style={{ fontWeight: '600', color: 'var(--gh-text-secondary)', marginBottom: '8px' }}>Assignees</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fas fa-shield-alt" style={{ color: 'var(--gh-text-secondary)', fontSize: '14px' }}></i>
              <span style={{ fontWeight: '500', color: 'var(--gh-text-primary)' }}>nilesh0002</span>
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--gh-text-secondary)', marginTop: '6px', lineHeight: '1.4' }}>
              Repository owner (assigned automatically).
            </div>
          </div>

          {/* Labels - INTERACTIVE */}
          <div style={{ borderBottom: '1px solid var(--gh-border)', paddingBottom: '14px', fontSize: '12px' }}>
            <div style={{ fontWeight: '600', color: 'var(--gh-text-secondary)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Labels</span>
              <span style={{ fontSize: '10px', color: 'var(--gh-text-secondary)', fontWeight: 'normal' }}>Click to toggle</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {/* Opportunity Label */}
              <button 
                type="button"
                onClick={() => handleLabelToggle('Opportunity')}
                style={{
                  textAlign: 'left',
                  width: 'fit-content',
                  background: selectedLabels.includes('Opportunity') ? 'rgba(88, 166, 255, 0.15)' : 'transparent',
                  border: '1px solid ' + (selectedLabels.includes('Opportunity') ? 'rgba(88, 166, 255, 0.4)' : 'var(--gh-border)'),
                  color: selectedLabels.includes('Opportunity') ? 'var(--gh-link)' : 'var(--gh-text-secondary)',
                  padding: '4px 10px',
                  borderRadius: '2em',
                  fontWeight: '600',
                  fontSize: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--gh-link)' }}></span>
                Opportunity
                {selectedLabels.includes('Opportunity') && <i className="fas fa-check" style={{ fontSize: '8px' }}></i>}
              </button>

              {/* Message Label */}
              <button 
                type="button"
                onClick={() => handleLabelToggle('Message')}
                style={{
                  textAlign: 'left',
                  width: 'fit-content',
                  background: selectedLabels.includes('Message') ? 'rgba(46, 160, 67, 0.15)' : 'transparent',
                  border: '1px solid ' + (selectedLabels.includes('Message') ? 'rgba(46, 160, 67, 0.4)' : 'var(--gh-border)'),
                  color: selectedLabels.includes('Message') ? '#3fb950' : 'var(--gh-text-secondary)',
                  padding: '4px 10px',
                  borderRadius: '2em',
                  fontWeight: '600',
                  fontSize: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#3fb950' }}></span>
                Message
                {selectedLabels.includes('Message') && <i className="fas fa-check" style={{ fontSize: '8px' }}></i>}
              </button>

              {/* Collaboration Label */}
              <button 
                type="button"
                onClick={() => handleLabelToggle('Collaboration')}
                style={{
                  textAlign: 'left',
                  width: 'fit-content',
                  background: selectedLabels.includes('Collaboration') ? 'rgba(163, 113, 247, 0.15)' : 'transparent',
                  border: '1px solid ' + (selectedLabels.includes('Collaboration') ? 'rgba(163, 113, 247, 0.4)' : 'var(--gh-border)'),
                  color: selectedLabels.includes('Collaboration') ? '#a371f7' : 'var(--gh-text-secondary)',
                  padding: '4px 10px',
                  borderRadius: '2em',
                  fontWeight: '600',
                  fontSize: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#a371f7' }}></span>
                Collaboration
                {selectedLabels.includes('Collaboration') && <i className="fas fa-check" style={{ fontSize: '8px' }}></i>}
              </button>
            </div>
          </div>

          {/* Projects */}
          <div style={{ borderBottom: '1px solid var(--gh-border)', paddingBottom: '14px', fontSize: '12px' }}>
            <div style={{ fontWeight: '600', color: 'var(--gh-text-secondary)', marginBottom: '8px' }}>Projects</div>
            <span style={{ color: 'var(--gh-text-primary)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="fas fa-columns" style={{ color: 'var(--gh-text-secondary)' }}></i>
              Portfolio Inbox
            </span>
          </div>

          {/* Milestone - INTERACTIVE PROGRESS BAR */}
          <div style={{ borderBottom: '1px solid var(--gh-border)', paddingBottom: '14px', fontSize: '12px' }}>
            <div style={{ fontWeight: '600', color: 'var(--gh-text-secondary)', marginBottom: '8px' }}>Milestone</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ color: 'var(--gh-text-primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="fas fa-flag" style={{ color: 'var(--gh-text-secondary)' }}></i>
                Hire Nilesh 💼
              </span>
              
              {/* Progress bar container */}
              <div style={{ marginTop: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--gh-text-secondary)', marginBottom: '2px' }}>
                  <span>85% complete</span>
                  <span>2027 Grad</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--gh-border)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: '85%', 
                    height: '100%', 
                    backgroundColor: '#2ea043', 
                    borderRadius: '3px',
                    boxShadow: '0 0 4px #3fb950',
                    animation: 'pulse-glow 2s infinite ease-in-out'
                  }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div style={{ fontSize: '12px' }}>
            <div style={{ fontWeight: '600', color: 'var(--gh-text-secondary)', marginBottom: '8px' }}>Notifications</div>
            <button className="gh-btn w-full" style={{ fontSize: '11px', padding: '4px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }} disabled>
              <i className="fas fa-bell"></i> Subscribed
            </button>
            <p style={{ fontSize: '10.5px', color: 'var(--gh-text-secondary)', marginTop: '8px', lineHeight: '1.4' }}>
              You will receive a notification in your email inbox when Nilesh replies.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
