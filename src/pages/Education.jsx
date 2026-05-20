import React from 'react';

const Education = () => {
  return (
    <div className="gh-content">
      <div style={{ borderBottom: '1px solid var(--gh-border)', paddingBottom: '16px', marginBottom: '28px' }}>
        <h1 className="f4" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fas fa-graduation-cap"></i>Education Background
        </h1>
        <p style={{ color: 'var(--gh-text-secondary)', fontSize: '13px', marginTop: '6px' }}>
          My academic journey, qualifications, and core coursework.
        </p>
      </div>

      <div className="education-section mt-4" style={{ maxWidth: '800px' }}>
        <div className="timeline">
          {/* Item 1 */}
          <div className="timeline-item">
            <div className="timeline-icon active">
              <i className="fas fa-university"></i>
            </div>
            <div className="timeline-content">
              <div className="timeline-header">
                <div>
                  <div className="timeline-title" style={{ fontSize: '16px', fontWeight: '600' }}>
                    Bachelor of Technology in Computer Science and Engineering
                  </div>
                  <div className="timeline-subtitle" style={{ fontSize: '14px', marginTop: '4px', color: 'var(--gh-text-secondary)' }}>
                    University Name
                  </div>
                </div>
                <div className="timeline-date">2021 - 2025</div>
              </div>
              <div className="timeline-body">
                <p style={{ marginBottom: '12px' }}>
                  Currently pursuing my B.Tech degree with a focus on Full Stack Development and Machine Learning.
                </p>
                <h4 style={{ fontSize: '13px', marginBottom: '8px', color: 'var(--gh-text-secondary)', fontWeight: '600' }}>
                  Relevant Coursework:
                </h4>
                <div className="topic-tags">
                  <span className="topic-tag">Data Structures</span>
                  <span className="topic-tag">Algorithms</span>
                  <span className="topic-tag">Operating Systems</span>
                  <span className="topic-tag">Database Management</span>
                  <span className="topic-tag">Computer Networks</span>
                  <span className="topic-tag">Machine Learning</span>
                </div>
              </div>
            </div>
          </div>

          {/* Item 2 */}
          <div className="timeline-item">
            <div className="timeline-icon">
              <i className="fas fa-school"></i>
            </div>
            <div className="timeline-content">
              <div className="timeline-header">
                <div>
                  <div className="timeline-title" style={{ fontSize: '16px', fontWeight: '600' }}>
                    Higher Secondary Education (Class XII)
                  </div>
                  <div className="timeline-subtitle" style={{ fontSize: '14px', marginTop: '4px', color: 'var(--gh-text-secondary)' }}>
                    Science Stream (PCM)
                  </div>
                </div>
                <div className="timeline-date">2019 - 2021</div>
              </div>
              <div className="timeline-body">
                Completed 12th grade with a strong foundation in Mathematics, Physics, and Chemistry. Developed an early interest in logical problem solving and programming.
              </div>
            </div>
          </div>

          {/* Item 3 */}
          <div className="timeline-item">
            <div className="timeline-icon">
              <i className="fas fa-book"></i>
            </div>
            <div className="timeline-content">
              <div className="timeline-header">
                <div>
                  <div className="timeline-title" style={{ fontSize: '16px', fontWeight: '600' }}>
                    Secondary Education (Class X)
                  </div>
                  <div className="timeline-subtitle" style={{ fontSize: '14px', marginTop: '4px', color: 'var(--gh-text-secondary)' }}>
                    High School
                  </div>
                </div>
                <div className="timeline-date">2019</div>
              </div>
              <div className="timeline-body">
                Completed high school with excellent academic performance, building a strong base in core subjects.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Education;
