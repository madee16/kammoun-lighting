import { useEffect, useState } from 'react';
import { PAGE_COPY, TESTIMONIALS } from '../../data/siteContent.js';
import { supabase } from '../../lib/supabase.js';

export function TestimonialsSection() {
  const [visitorName, setVisitorName] = useState('');
  const [visitorLocation, setVisitorLocation] = useState('');
  const [comment, setComment] = useState('');
  const [formStatus, setFormStatus] = useState('');
  const [approvedTestimonials, setApprovedTestimonials] = useState(TESTIMONIALS);

  useEffect(() => {
    const loadTestimonials = async () => {
      if (!supabase) return;

      const { data, error } = await supabase
        .from('testimonials')
        .select('id,name,location,comment,created_at')
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (!error && data?.length) {
        setApprovedTestimonials(
          data.map((testimonial) => ({
            ...testimonial,
            text: testimonial.comment,
          })),
        );
      }
    };

    loadTestimonials();
  }, []);

  const submitComment = async (event) => {
    event.preventDefault();

    if (!visitorName.trim() || !comment.trim()) {
      setFormStatus(PAGE_COPY.testimonials.missingFieldsMessage);
      return;
    }

    if (!supabase) {
      setFormStatus(PAGE_COPY.testimonials.errorMessage);
      return;
    }

    const { error } = await supabase.from('testimonials').insert({
      name: visitorName.trim(),
      location: visitorLocation.trim() || null,
      comment: comment.trim(),
      approved: false,
    });

    if (error) {
      setFormStatus(PAGE_COPY.testimonials.errorMessage);
      return;
    }

    setVisitorName('');
    setVisitorLocation('');
    setComment('');
    setFormStatus(PAGE_COPY.testimonials.successMessage);
  };

  return (
    <section className="section testimonials-section">
      <div className="section-header">
        <div>
          <p className="eyebrow">{PAGE_COPY.testimonials.eyebrow}</p>
          <h2>{PAGE_COPY.testimonials.title}</h2>
        </div>
        <p className="section-note">{PAGE_COPY.testimonials.text}</p>
      </div>
      <div className="testimonial-layout">
        <div className="testimonial-grid">
          {approvedTestimonials.map((testimonial) => (
            <article className="testimonial-card" key={testimonial.id || testimonial.name}>
              <p>{testimonial.text}</p>
              <div>
                <strong>{testimonial.name}</strong>
                {testimonial.location && <span>{testimonial.location}</span>}
              </div>
            </article>
          ))}
        </div>
        <form className="comment-form" onSubmit={submitComment}>
          <h3>{PAGE_COPY.testimonials.formTitle}</h3>
          <input
            value={visitorName}
            onChange={(event) => setVisitorName(event.target.value)}
            placeholder={PAGE_COPY.testimonials.namePlaceholder}
          />
          <input
            value={visitorLocation}
            onChange={(event) => setVisitorLocation(event.target.value)}
            placeholder={PAGE_COPY.testimonials.locationPlaceholder}
          />
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder={PAGE_COPY.testimonials.commentPlaceholder}
            rows="4"
          />
          <button className="primary-button" type="submit">
            {PAGE_COPY.testimonials.submitLabel}
          </button>
          <p>{PAGE_COPY.testimonials.helperText}</p>
          {formStatus && (
            <p className="form-status info" role="status">
              {formStatus}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}