using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LearnLanguage.Application.Common.DTOs
{
    public class ReponseListDTO<T>
    {
        public int pageNumber { get; set; } = 1;
        public int pageSize { get; set; } = 10;
        public int totalRecords { get; set; }
        public T? data { get; set; }
    }
}