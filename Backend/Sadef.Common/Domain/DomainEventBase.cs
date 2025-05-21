using System;
using MediatR;

namespace Sadef.Common.Domain
{
    public interface IDomainEvent : INotification
    {
        DateTime CreatedAt { get; }
        IDictionary<string, object> MetaData { get; }
    }

    public interface IDomainEventContext
    {
        IEnumerable<DomainEventBase> GetDomainEvents();
    }

    public abstract class DomainEventBase : IDomainEvent
    {
        public DateTime CreatedAt { get; } = DateTime.UtcNow;
        public IDictionary<string, object> MetaData { get; } = new Dictionary<string, object>();
    }
}
