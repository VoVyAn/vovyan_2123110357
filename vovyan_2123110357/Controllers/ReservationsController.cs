using Microsoft.AspNetCore.Mvc;
using vovyan_2123110357.Data;
using vovyan_2123110357.Models;
using Microsoft.EntityFrameworkCore;

namespace vovyan_2123110357.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservationsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReservationsController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/Reservations
        [HttpPost]
        public async Task<ActionResult<Reservation>> PostReservation(Reservation reservation)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Reservations.Add(reservation);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetReservation", new { id = reservation.Id }, reservation);
        }

        // GET: api/Reservations/5 (Needed for CreatedAtAction)
        [HttpGet("{id}")]
        public async Task<ActionResult<Reservation>> GetReservation(int id)
        {
            var reservation = await _context.Reservations.FindAsync(id);

            if (reservation == null)
            {
                return NotFound();
            }

            return reservation;
        }

        // GET: api/Reservations (For Admin)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Reservation>>> GetReservations()
        {
            return await _context.Reservations.OrderByDescending(r => r.CreatedAt).ToListAsync();
        }

        // PUT: api/Reservations/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReservation(int id, Reservation reservation)
        {
            var existingReservation = await _context.Reservations.FindAsync(id);
            if (existingReservation == null)
            {
                return NotFound();
            }

            existingReservation.CustomerName = reservation.CustomerName;
            existingReservation.Phone = reservation.Phone;
            existingReservation.Email = reservation.Email;
            existingReservation.ReservationDate = reservation.ReservationDate;
            existingReservation.NumberOfGuests = reservation.NumberOfGuests;
            existingReservation.StoreName = reservation.StoreName;
            existingReservation.Note = reservation.Note;
            existingReservation.Status = reservation.Status;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReservationExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Reservations/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReservation(int id)
        {
            var reservation = await _context.Reservations.FindAsync(id);
            if (reservation == null)
            {
                return NotFound();
            }

            _context.Reservations.Remove(reservation);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ReservationExists(int id)
        {
            return _context.Reservations.Any(e => e.Id == id);
        }
    }
}
