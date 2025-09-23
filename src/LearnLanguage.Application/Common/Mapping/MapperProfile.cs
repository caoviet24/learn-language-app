using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using LearnLanguage.Application.Auth.Commands.Register;
using LearnLanguage.Application.Auth.Queries;
using LearnLanguage.Application.Topic.Commands;
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
            CreateMap<User, GetMyInfoDto>();
            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<UpdateUserCommand, User>().ReverseMap();


            CreateMap<Topics, TopicDto>().ReverseMap();
            CreateMap<CreateTopicCommand, Topics>();


        }
    }
}