using Microsoft.EntityFrameworkCore;
using Mission_11.Models;

namespace Mission_11.Data;

public class BookstoreContext : DbContext
{
    public BookstoreContext(DbContextOptions<BookstoreContext> options) : base(options) { }

    public DbSet<Book> Books { get; set; }
}