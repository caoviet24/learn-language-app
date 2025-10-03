using LearnLanguage.Domain.Common;
using LearnLanguage.Domain.Constants;
using LearnLanguage.Domain.ValueObjects;

namespace LearnLanguage.Domain.Entities;

public class User : BaseAuditableEntity
{
    public Email email { get; set; }
    public string password { get; set; }
    public string firstName { get; set; }
    public string lastName { get; set; }
    public string nickName { get; set; }
    public string role { get; set; }
    public bool isEmailConfirmed { get; set; }
    public DateTime? emailConfirmedAt { get; set; }
    public virtual ICollection<Topics> topics { get; set; } = new List<Topics>();
    public virtual ICollection<Lessons> lessons { get; set; } = new List<Lessons>();
    public virtual ICollection<Levels> levels { get; set; } = new List<Levels>();
    public virtual ICollection<UserActivity> userActivities { get; set; } = new List<UserActivity>();
    public User()
    {

    }
    public User(Email email, string passwordHash, string firstName, string lastName, string role) : base()
    {
        this.email = email ?? throw new ArgumentNullException(nameof(email));
        this.password = passwordHash;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.nickName = string.Empty;
        this.isEmailConfirmed = false;
        this.emailConfirmedAt = null;
    }
}