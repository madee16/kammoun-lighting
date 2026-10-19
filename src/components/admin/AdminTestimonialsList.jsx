import { CheckCircle2, MessageCircle, Trash2 } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState.jsx';
import { FormStatus } from '../ui/FormStatus.jsx';
import { ADMIN_COPY } from '../../data/siteContent.js';

export function AdminTestimonialsList({
  adminTestimonials,
  testimonialStatus,
  approveTestimonial,
  removeTestimonial,
}) {
  return (
    <div className="admin-list-panel testimonials-admin-panel">
      <div className="panel-title">
        <div>
          <h2>{ADMIN_COPY.testimonialsTitle}</h2>
          <p>{ADMIN_COPY.testimonialsHint}</p>
        </div>
        <MessageCircle size={22} />
      </div>
      <div className="admin-list">
        {adminTestimonials.length ? (
          adminTestimonials.map((testimonial) => (
            <div className="admin-row testimonial-admin-row" key={testimonial.id}>
              <div>
                <strong>{testimonial.name}</strong>
                <span className="admin-row-meta">
                  <span className={`approval-badge ${testimonial.approved ? 'approved' : 'pending'}`}>
                    {testimonial.approved ? ADMIN_COPY.approvedLabel : 'En attente'}
                  </span>
                  {testimonial.location}
                </span>
                <p>{testimonial.comment}</p>
              </div>
              <div className="row-actions">
                {!testimonial.approved && (
                  <button
                    className="icon-button"
                    type="button"
                    onClick={() => approveTestimonial(testimonial)}
                    title={ADMIN_COPY.approveLabel}
                  >
                    <CheckCircle2 size={18} />
                  </button>
                )}
                <button
                  className="icon-button danger"
                  type="button"
                  onClick={() => removeTestimonial(testimonial)}
                  title={ADMIN_COPY.deleteLabel}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            icon={MessageCircle}
            title="Aucun avis"
            text={ADMIN_COPY.emptyTestimonials}
          />
        )}
      </div>
      <FormStatus status={testimonialStatus} />
    </div>
  );
}
