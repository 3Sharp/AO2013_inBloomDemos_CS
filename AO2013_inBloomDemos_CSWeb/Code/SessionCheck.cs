using System.Runtime.Serialization;

namespace inBloomCode
{

    /// <summary>
    /// Strong typed version of the object returned by inBloom containing
    /// the users information (Session/Check).
    /// </summary>
    [DataContract]
    public class SessionCheck : JSONObject
    {
        [DataMember(Name = "authenticated")]
        public bool Authenticated;
        [DataMember(Name = "edOrg")]
        public string EducationOrganization;
        [DataMember(Name = "edOrgId")]
        public string EducationOrganizationId;
        [DataMember(Name = "email")]
        public string Email;
        [DataMember(Name = "external_id")]
        public string ExternalId;
        [DataMember(Name = "full_name")]
        public string FullName;
        [DataMember(Name = "granted_authorities")]
        public string[] GrantedAuthorities;
        [DataMember(Name = "isAdminUser")]
        public bool IsAdminUser;
        [DataMember(Name = "realm")]
        public string Realm;
        [DataMember(Name = "rights")]
        public string[] Rights;
        [DataMember(Name = "sliRoles")]
        public string[] SliRoles;
        [DataMember(Name = "tenantId")]
        public string TenantId;
        [DataMember(Name = "user_id")]
        public string UserId;
    }
}