using System.ComponentModel.DataAnnotations;

namespace Sadef.Common.Domain
{
    public abstract class EntityBase : EntityWithIdBase<int>
    {
        protected EntityBase() : base()
        {
        }

        protected EntityBase(int id) : base(id) // auto increment integer identities are used as default. for projects needed guid as default use EntityBase(Guid id): base(Generate())
        {
        }
    }

    /// <inheritdoc />
    /// <summary>
    ///  Supertype for all Entity types
    /// </summary>
    public interface IEntityWithId<TId> : IIdentityWithId<TId>
    {
    }

    public interface IEntity : IEntityWithId<int>
    {
    }


    /// <inheritdoc />
    /// <summary>
    ///  Source: https://github.com/VaughnVernon/IDDD_Samples_NET
    /// </summary>
    public abstract class EntityWithIdBase<TId> : IEntityWithId<TId>
    {
        protected EntityWithIdBase()
        {
        }

        protected EntityWithIdBase(TId id)
        {
            Id = id;
        }
        //[DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Key] public TId Id { get; set; }

        public DateTime? CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? UpdatedBy { get; set; }

        public void CreateEvent()
        {
            CreatedAt = DateTime.Now;
            CreatedBy = "";
            UpdatedAt = DateTime.Now;
            UpdatedBy = "";
        }

    }
}
