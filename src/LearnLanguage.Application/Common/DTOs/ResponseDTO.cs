using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LearnLanguage.Application.Common.DTOs
{
    public class ResponseDTO<T> 
    {
        public bool success { get; set; }
        public string message { get; set; } = null!;
        public T? data { get; set; } = default!;
    }
}