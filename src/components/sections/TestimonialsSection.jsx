import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Highlight } from '../ui/Highlight.jsx';
import { PAGE_COPY, TESTIMONIALS } from '../../data/siteContent.js';
import { supabase } from '../../lib/supabase.js';

export function TestimonialsSection() {
  const [visitorName, setVisitorName] = useState('');
  const [visitorLocation, setVisitorLocation] = useState('');
  const [comment, setComment] = useState('');
  const [formStatus, setFormStatus] = useState('');
  const [approvedTestimonials, setApprovedTestimonials] = useState(TESTIMONIALS);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const count = approvedTestimonials.length;
  const activeIndex = count ? Math.min(index, count - 1) : 0;

  useEffect(() => {
    if (paused || count < 2) return;
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % count);
    }, 6000);
    return () => window.clearInterval(id);
  }, [paused, count]);

  const goTo = (nextIndex) => setIndex((nextIndex + count) % count);

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
      <div className="section-header header-center">
        <div>
          <div className="section-index-row">
            <span className="section-index">03</span>
            <p className="eyebrow">{PAGE_COPY.testimonials.eyebrow}</p>
          </div>
          <h2>
            <Highlight text={PAGE_COPY.testimonials.title} words={['clients']} />
          </h2>
        </div>
        {PAGE_COPY.testimonials.text && (
          <p className="section-note">{PAGE_COPY.testimonials.text}</p>
        )}
      </div>
      <div className="testimonial-layout">
        {count > 0 && (
          <div
            className="testimonial-carousel"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {approvedTestimonials.map((testimonial, i) => (
              <article
                className={`testimonial-card carousel-card${i === activeIndex ? ' active' : ''}`}
                key={testimonial.id || testimonial.name}
                aria-hidden={i !== activeIndex}
              >
                <Quote className="testimonial-quote" size={26} aria-hidden="true" />
                <p>{testimonial.text}</p>
                <div className="testimonial-author">
                  <span className="testimonial-avatar" aria-hidden="true">
                    {String(testimonial.name || '')
                      .trim()
                      .split(/\s+/)
                      .map((word) => word[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                  <span className="testimonial-author-info">
                    <strong>{testimonial.name}</strong>
                    {testimonial.location && <span>{testimonial.location}</span>}
                  </span>
                </div>
              </article>
            ))}
            <nav className="carousel-nav" aria-label="Temoignages">
              <button
                className="carousel-arrow"
                type="button"
                aria-label="Temoignage precedent"
                onClick={() => goTo(activeIndex - 1)}
              >
                <ChevronLeft size={18} />
              </button>
              <div className="carousel-dots">
                {approvedTestimonials.map((testimonial, i) => (
                  <button
                    className={`carousel-dot${i === activeIndex ? ' active' : ''}`}
                    type="button"
                    key={testimonial.id || testimonial.name || i}
                    aria-label={`Voir le temoignage ${i + 1}`}
                    onClick={() => setIndex(i)}
                  />
                ))}
              </div>
              <button
                className="carousel-arrow"
                type="button"
                aria-label="Temoignage suivant"
                onClick={() => goTo(activeIndex + 1)}
              >
                <ChevronRight size={18} />
              </button>
            </nav>
          </div>
        )}
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
          {PAGE_COPY.testimonials.helperText && <p>{PAGE_COPY.testimonials.helperText}</p>}
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