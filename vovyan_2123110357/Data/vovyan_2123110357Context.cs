using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using vovyan_2123110357.Model;

namespace vovyan_2123110357.Data
{
    public class vovyan_2123110357Context : DbContext
    {
        public vovyan_2123110357Context (DbContextOptions<vovyan_2123110357Context> options)
            : base(options)
        {
        }

        public DbSet<vovyan_2123110357.Model.Product> Product { get; set; } = default!;
    }
}
