using System.Collections.Generic;

namespace Sadef.Common.Infrastructure.AspNetCore.Authz
{
    public class AuthNOptions
    {
        public Dictionary<string, string> ClaimToScopeMap { get; set; }
        public Dictionary<string, string> Scopes { get; set; }
        public string OktaBaseUri { get; set; }
        public string Audience { get; set; }
        public string Issuer { get; set; }
        public string Secret { get; set; }
        public string OktaAuthorizationServer { get; set; }
    }
}
