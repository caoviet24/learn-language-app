using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LearnLanguage.Application.Events
{
    public class UserRegisteredEvent
    {
        public const string EventName = "UserRegisteredEvent";
        public string userId { get; }
        public string email { get; }
        public string password { get; }
        public string firstName { get; }
        public string lastName { get; }
        public string role { get; }
        public UserRegisteredEvent(string userId, string email, string password, string firstName, string lastName, string role)
        {
            this.userId = userId;
            this.email = email;
            this.password = password;
            this.firstName = firstName;
            this.lastName = lastName;
            this.role = role;
        }
    }
}