# appointment-booking-backend
Appointment Booking API
Description
This is a simple Appointment Booking API built using Node.js, Express, MongoDB, and Mongoose. The API allows clients to book appointments with experts, cancel bookings, view available slots, and fetch usage analytics.

Features:
User Registration and Login
Slot Management (Add, Delete, Get available slots)
Book and Cancel Appointments
Fetch Available Slots for Experts
Admin Analytics (Booking and No-show Statistics)

Setup Instructions
1. Clone the repository
Clone this repository to your local machine:
git clone https://github.com/amarkumarsbg/appointment-booking-backend.git

2. Install dependencies
Navigate to the project folder and install the required dependencies:
cd appointment-booking-api
npm install

3. Create a .env file
Create a .env file at the root of the project and add the following variables. Make sure to replace the placeholder values with your actual information.
# .env

MONGO_URI=mongodb+srv://admin:admin@cluster0.7i9oo.mongodb.net/booking-app?retryWrites=true&w=majority&appName=Cluster0
PORT=4000
JWT_SECRET=yqwertyuiop


•  MONGODB_URI: The connection string for your MongoDB database.
•  JWT_SECRET: A secret key used to sign JWT tokens for user authentication.
•  PORT: The port on which the server will run (default: 4000).

4. Start the server
After the environment variables are set up, you can start the server:
npm run dev

The server should now be running at http://localhost:4000.

API Usage
Authentication
All API endpoints (except for public ones like signup and login) require a JWT token for authentication. The token should be included in the Authorization header as Bearer <token>.
Endpoints
1. User Routes
•	POST /api/users/signup
Sign up a new user.
Request body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "client"
}

POST /api/users/login
Log in and get a JWT token.
Request body:
{
  "email": "john@example.com",
  "password": "password123"
}
Response:
{
  "token": "jwt_token_here"
}

2. Expert Routes
•	POST /api/experts/slots
Expert creates a new slot.
Request body:
{
  "date": "2025-02-05",
  "startTime": "09:00",
  "endTime": "15:00",
  "slotDuration": 30
}


3. Booking Routes
•	POST /api/bookings/book
Client books a slot.
Request body:
{
  "clientId": "client_object_id",
  "expertId": "expert_object_id",
  "date": "2025-02-05",
  "startTime": "09:00",
  "slotDuration": 30
}

Response:
{
  "message": "Slot booked successfully",
  "booking": {
    "clientId": "client_object_id",
    "expertId": "expert_object_id",
    "slotId": "slot_object_id"
  }
}

DELETE /api/bookings/cancel/:id
Cancel a booking.
Response:
{
  "message": "Booking canceled successfully"
}

GET /api/bookings/client/:id
Get all bookings for a specific client.


GET /api/bookings/recommendations
Get available slots for a specific expert.
Query parameter: expertId=<expert_id>


4. Admin Routes
•	GET /api/admin/analytics/usage
Get booking and no-show statistics for admin.
Response:
{
  "totalBookings": 150,
  "completedBookings": 120,
  "noShowBookings": 30
}
