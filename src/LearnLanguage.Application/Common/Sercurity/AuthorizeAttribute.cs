using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LearnLanguage.Application.Common.Sercurity
{
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = true)]
    public class AuthorizeAttribute : Attribute
    {
        private string? _role;
        private string[]? _roles;

        /// <summary>
        /// Gets or sets the roles that are permitted to access the resource.
        /// Multiple roles can be specified as a comma-separated string (e.g., "ADMIN,LECTURER").
        /// Access will be granted if the user belongs to any of the specified roles.
        /// </summary>
        public string? Role
        {
            get => _role;
            set
            {
                _role = value;
                if (!string.IsNullOrEmpty(value))
                {
                    _roles = value.Split(',').Select(r => r.Trim()).ToArray();
                }
            }
        }

        /// <summary>
        /// Gets the array of roles parsed from the Role property.
        /// </summary>
        internal string[]? Roles => _roles;

        /// <summary>
        /// Initializes a new instance of the AuthorizeAttribute.
        /// </summary>
        public AuthorizeAttribute()
        {
        }

        /// <summary>
        /// Initializes a new instance of the AuthorizeAttribute with a specified role.
        /// </summary>
        /// <param name="role">The role that is permitted to access the resource.</param>
        public AuthorizeAttribute(string role)
        {
            Role = role;
        }
    }
}