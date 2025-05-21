namespace Sadef.Common.Domain
{
    /// <summary>
    ///     Supertype for all Identity types
    /// </summary>
    public interface IIdentity
    {
        int Id { get; } // Integer ID was used over Guid as the data model in TRIPPS is primarily uses integer IDs
    }

    /// <summary>
    ///     Supertype for all Identity types with generic Id
    /// </summary>
    public interface IIdentityWithId<TId>
    {
        TId Id { get; }
    }

    // integer identities have been used here.
    public abstract class IdentityBase : IdentityBase<int>
    {
        protected IdentityBase() // : base(GenerateId()) Guid is replaced with integer id
        {
        }
    }

    /// <summary>
    ///     Source: https://github.com/VaughnVernon/IDDD_Samples_NET
    /// </summary>
#pragma warning disable S4035 // Classes implementing "IEquatable<T>" should be sealed
    public abstract class IdentityBase<TId> : IEquatable<IdentityBase<TId>>, IIdentityWithId<TId>
#pragma warning restore S4035 // Classes implementing "IEquatable<T>" should be sealed
    {

        // currently for Entity Framework, set must be protected, not private.
        // will be fixed in EF 6.
        public TId Id { get; protected set; }

        protected IdentityBase()
        {
        }

        protected IdentityBase(TId id)
        {
            Id = id;
        }

        public bool Equals(IdentityBase<TId> other)
        {
            if (ReferenceEquals(this, other))
                return true;
            return !ReferenceEquals(null, other) && Id.Equals(other.Id);
        }

        public override bool Equals(object obj)
        {
            return Equals(obj as IdentityBase<TId>);
        }

        public override int GetHashCode()
        {
            return GetType().GetHashCode() * 907 + Id.GetHashCode();
        }

        public override string ToString()
        {
            return $"{GetType().Name} [Id={Id}]";
        }

    }
}
