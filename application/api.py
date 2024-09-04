from flask_restful import Resource
from flask_restful import fields, marshal_with
from flask_restful import reqparse
from application.validation import Not_Given_Error, Not_Found_Error
from application.models import User,Venue,Show,Booking,Rate
from application.database import db
from sqlalchemy import func
import matplotlib.pyplot as plt

from flask import current_app as app, jsonify,make_response
from flask_security import current_user,login_required, roles_required,auth_required
from sqlalchemy import or_
from flask_caching import Cache
from time import perf_counter_ns
import matplotlib
matplotlib.use('Agg')


cache=Cache(app)
app.app_context().push()


user_fields = {
    "id": fields.Integer,
    "user_name": fields.String,
    "email": fields.String,
    "password": fields.String,
}
# ----------------------------------------------------------------------------------------#

venue_fields = {
    "venue_id": fields.Integer,
    "venue_name": fields.String,
    "place": fields.String,
    "location": fields.String,
}
# ----------------------------------------------------------------------------------------#
show_fields = {
    "show_id": fields.Integer,
    "show_name": fields.String,
    "rating": fields.Integer,
    "timings": fields.DateTime(dt_format="rfc822"),
    "tags": fields.String,
    "seats": fields.Integer,
    "price": fields.Integer,

}


# ----------------------------------------------------------------------------------------#
def utojson(user):
    return {
        "userid":user.id,
        "user_name": user.username,
        "email":user.email,

    }
 # ----------------------------------------------------------------------------------------#   
def showtojson(show):
    return {
        "show_id": show.id,
        "show_name": show.Show_name,
        "ratings": show.ratings,
        "timings": show.timings.strftime("%d/%m/%Y %I:%M %p"),
        "tags": show.tags,
        "movie_description":show.movie_description,
        "seats": show.seats,
        "price": show.price,
    }





class BookedshowAPI(Resource):
    @auth_required('token')
    def get(self):

        user_id = current_user.id

        # Fetch all bookings for the user
        bookings = Booking.query.filter_by(user_id=user_id).all()

        # Create a list to store the booking details
        bookings_data = []

        # Iterate through each booking
        for booking in bookings:
            show = Show.query.get(booking.show_id)  # Fetch the associated show
            venue = Venue.query.get(show.venue_id)  # Fetch the associate
            booking_data = {
                "sb_id": booking.show_id,
                "user_id": booking.user_id,
                "seats_booked": booking.number_of_bookings,
                "show_name": show.Show_name,
                "timings": show.timings.strftime("%Y-%m-%d %H:%M:%S"),
                "venue_name": venue.venue_name,
                "venue_location": venue.location,
                "venue_place": venue.place
            }

            bookings_data.append(booking_data)
        return jsonify(bookings_data)   

        
    @auth_required('token')
    def post(self, show_id):
        
        user_id=current_user.id
        bookedshow_parse = reqparse.RequestParser()
        bookedshow_parse.add_argument("NOS")
        args = bookedshow_parse.parse_args()
        Num_of_b= args.get("NOS")

        if Num_of_b is None:
            raise Not_Given_Error(
                status_code=400,
                error_code="BOOKING01",
                error_message="seats is required",
            )

        show = Show.query.filter_by(id=show_id).first()
        show.seats-=int(Num_of_b)
        nseats=show.seats
        show=Show(
            seats=nseats
            
        )
        
        if not show:
            raise Not_Found_Error(status_code=404)

        booking= Booking(
            show_id=show_id,
            user_id=user_id,
            number_of_bookings=int(Num_of_b)
        )
        db.session.add(booking)
        db.session.commit()

        if int(show.seats)+int(Num_of_b) < int(Num_of_b):
            raise Not_Given_Error(
                status_code=400,
                error_code="BOOKING02",
                error_message="this much seat are not available",
            )

        
        bookedshow = {
            "seats_booked": booking.number_of_bookings,
            "bshow_id": booking.show_id,
            "user_id": booking.user_id,
        }
        return bookedshow, 200
# -------------------

    
    
class BookdetailsAPI(Resource):
    @auth_required('token')
    def get(self, show_id):
        show = Show.query.filter_by(id=show_id).first()
        venue_id = show.venue_id
        venue = Venue.query.filter_by(id=venue_id).first()

        showdata = showtojson(show)
        showdata["venue_name"] = venue.venue_name
        showdata["venue_location"] = venue.location
        showdata["venue_place"] = venue.place

        return jsonify(showdata)


# ----------------------------------------------------------------------------------------#

class ProfileAPI(Resource):
    @auth_required('token')
    # @cache.cached(timeout=60)
    def get(self):
        user_id=current_user.id
    
        user=User.query.filter_by(id=user_id).first()
        print(user)
        if user:
            print(user)
            print(jsonify(utojson(user)))
            return jsonify(utojson(user))
        else:
            return make_response("Not Found", 404)

            
        
# ----------------------------------------------------------------------------------------#



class ShowSummaryAPI(Resource):
    @auth_required('token')
    @roles_required('admin')
    # @cache.cached(timeout=10)
    def get(self):
        start=perf_counter_ns()
        venues=Venue.query.all()
        ven=[i.venue_name for i in venues]
        s=[]
        for i in venues:
            s.append(i.shows)
        les=[]
        for j in s:
            le=[]
            for p in j:
                sname = p.Show_name
                sid=p.id
                book=Booking.query.filter_by(show_id=sid)
                print(book)
                count=0
                for m in book:
                    count+=m.number_of_bookings
                print(count)
                sbook = count
                if sbook is not None:
                    le.append([sname, sbook])
            les.append(le)
        d={}
        for i in range(len(ven)):
            d[ven[i]]=les[i]
        for key, values in d.items():
            x_values = [va[0] for va in values]
            y_values = [va[1] for va in values]
            matplotlib.use('Agg')
            plt.clf()
            plt.pie(y_values,labels=x_values)
            plt.title(f'{key}')
            plt.savefig("static/js/"+f"{key}.png")
        stop=perf_counter_ns()
        print("Time taken", stop-start)
        return jsonify(ven)
      
        
# ----------------------------------------------------------------------------------------#

class RateAPI(Resource):
    @auth_required('token')
    def get(self):
        user_id=current_user.id
        r_of_show=Rate.query.filter_by(rateuser_id=user_id).all()
        show=[]
        for i in r_of_show:
            show.append(i.showname)
        return jsonify(show)
    @auth_required('token')
    def post(self,show_id):
        id=current_user.id
        rate_parse = reqparse.RequestParser()
        rate_parse.add_argument("rating")
        rate_parse.add_argument("review")
        args = rate_parse.parse_args()
        rate = int(args.get("rating"))
        review = args.get("review")
        if rate is None:
            raise Not_Given_Error(
                status_code=400,
                error_code="RATEING01",
                error_message="Rating is required",
            )
        if review is None:
            raise Not_Given_Error(
                status_code=400,
                error_code="RATEING02",
                error_message="Review is required",
            )

        rated = Rate.query.filter(
            Rate.rateuser_id == id, Rate.rateshow_id == show_id
        ).first()
        if rated:
            raise Not_Given_Error(
                status_code=400,
                error_code="RATEING03",
                error_message="dont review again",
            )
        else:
            show = Show.query.filter_by(id=show_id).first()
            if show:
                sn = show.Show_name
                Rateshow = Rate(
                    rating=rate,
                    review=review,
                    showname=sn,
                    rateuser_id=id,
                    rateshow_id=show_id,
                )
                db.session.add(Rateshow)
                db.session.commit()
                show.ratings = (show.ratings + rate) // 2
                db.session.commit()
                return jsonify({"message":"done completely"})
            else:
                raise Not_Found_Error(status_code=404)






# ----------------------------------------------------------------------------------------#












        
if __name__ == "__main__":
    app.run(debug=True)
