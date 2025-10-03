using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using LearnLanguage.Application.Auth.Commands.Register;
using LearnLanguage.Application.Auth.Queries;
using LearnLanguage.Application.Topic.Commands;
using LearnLanguage.Application.UserActivities.Commands.Create;
using LearnLanguage.Application.UserActivities.DTOs;
using LearnLanguage.Application.Users.Commands.Update;
using LearnLanguage.Application.Users.Queries.GetAll;
using LearnLanguage.Domain.Constants;
using LearnLanguage.Domain.Entities;
using LearnLanguage.Domain.ValueObjects;


namespace LearnLanguage.Application.Common.Mapping
{
    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            CreateMap<RegisterCommand, User>()
                .ConstructUsing(src => new User
                {
                    email = new Email(src.email),
                    password = src.password,
                    firstName = src.firstName,
                    lastName = src.lastName,
                    nickName = string.Empty,
                    role = Roles.User,
                    isEmailConfirmed = false,
                    emailConfirmedAt = null
                })
                .ReverseMap();
            CreateMap<User, RegisterResponse>();
            CreateMap<User, GetMyInfoDto>()
                .ForMember(dest => dest.userActivities, opt => opt.MapFrom(src => src.userActivities))
                .ReverseMap();
            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<UpdateUserCommand, User>().ReverseMap();


            CreateMap<Topics, TopicDto>().ReverseMap();
            CreateMap<CreateTopicCommand, Topics>();


            CreateMap<CreateUserActivityCommand, UserActivity>()
                .ConstructUsing(src => new UserActivity
                {
                    Id = Guid.NewGuid().ToString(),
                    exp = 0,
                    level = "Beginner",
                    streakDay = 0,
                    studyTimeToday = 0,
                    studyTimeEveryday = src.studyTimeEveryday,
                    totalStudyTime = 0,
                    languageStudying = src.languageStudying,
                    totalLessons = 0
                })
                .ReverseMap();
            CreateMap<UserActivity, UserActivityDTO>().ReverseMap();


        }
    }
}