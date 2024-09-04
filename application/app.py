from flask import Flask,render_template,jsonify,request,json
from flask_security import Security,auth_required ,hash_password,current_user
import application.config as config
from application.models import db,User,Show,Venue
from datetime import datetime
from flask import current_app as app
from sqlalchemy import or_
from .api import cache
from application import tasks

@app.route('/')
def home():
    return render_template('index.html')

@app.route("/registers", methods=['POST'])
def registers():
    if request.method == 'POST':
        post_data = request.get_json()
        username = post_data["username"]
        email = post_data["email"]
      
        password = post_data["password"]

        with app.app_context():
            user_datastore = app.security.datastore
            if not user_datastore.find_user(username=username) and not user_datastore.find_user(email=email):
                user_datastore.create_user(username=username, email=email, password=hash_password(password))
                db.session.commit()
                return jsonify({"message": "successfully registered!!"})
    return jsonify({"message": "registration unsuccess!!"})

@app.get('/shows_show/<id>')
def shows_show(id):
    try:
        show=Show.query.get(id)
        shows_list=list()
        b={"ratings":show.ratings,"price":show.price,"tags":show.tags,"show_name":show.Show_name,"seats":show.seats,"movie_desc":show.movie_description,"timings":show.timings}

        shows_list.append(b)
        print(b)
    
        return jsonify(shows_list)
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}),500



@app.route('/exportreport/<v_id>', methods=['GET', 'POST'])
def export_and_download(v_id):
    to = current_user.email
    job = tasks.export_venue_report.apply_async(args=[v_id, to])
    return "success" , 200

@app.get('/shows')
@auth_required('token')
def show():
    shows=Show.query.all()
    shows_list=list()
    for show in shows:
        b={"ratings":show.ratings,"price":show.price,"tags":show.tags}
        shows_list.append(b)
    return jsonify(shows_list)

def venuetojson(ven):
    return {
        "venue_name": ven.venue_name,
        "place":ven.place,
        "location":ven.location,
        "capacity":ven.capacity,
        "venueid":ven.id,
        
    }

def showtojson(show):
    return {
        "show_name":show.Show_name,
        "show_id":show.id,
        "ratings":show.ratings,
        "timings":show.timings,
        "tags":show.tags,
        "price":show.price,
        "seats":show.seats,
        "movie_desc":show.movie_description
    }

@app.get('/venues')
@auth_required('token')
# @cache.cached(timeout=10)
def venues():
    venues=Venue.query.all()
    d={}
    for venue in venues:
        slist=[]
        show=venue.shows
        
        if show:
            for i in show:
                slist.append(showtojson(i))
            d[json.dumps(venuetojson(venue))]=slist
        else:
            d[json.dumps(venuetojson(venue))]=[]

    return json.dumps(d)

@app.route("/createvenue", methods=['POST'])
def addvenue():
    data=request.get_json()
    print("venue name:",data.get("venue_name"),"place:",data.get("place"),"location:",data.get("location"),"Capacity:",data.get("capacity"))
    venue=Venue(venue_name=data.get("venue_name"),place=data.get("place"),location=data.get("location"),capacity=data.get("capacity"))
    print(venue)
    db.session.add(venue)
    db.session.commit()
    return jsonify("venue successfully added")
from flask import request, jsonify

@app.route("/updatevenue/<int:venueid>", methods=['POST'])
def updatevenue(venueid):
    data = request.get_json()
    vname=data["venue_name"]
    pl=data["place"]
    lc= data["location"]
    cap=data["capacity"]
    venue = Venue.query.filter_by(id=venueid).update({"venue_name":vname,"place":pl,"capacity":cap,"location":lc})
    db.session.commit()

    return jsonify({"msg":"Venue successfully updated"})

@app.route("/creatshow/<vid>", methods=['POST'])
def addshow(vid):
    try:
        print(vid)
        data3=request.get_json()
        data3['venueid']=vid
        timings_str = data3.get("timings")
        timings_obj = datetime.strptime(timings_str, "%Y-%m-%dT%H:%M")
        print(data3)
        print("show_name:",data3.get("show_name"),"ratings:",data3.get("ratings"),"timings:",data3.get("timings"),"tags:",data3.get("tags"),"price:",data3.get("price"),"vid:",data3.get("venueid"),"seats:",data3.get("seats"),"movie_desc:",data3.get("movie_desc"))
        show=Show(Show_name=data3.get("show_name"),ratings=data3.get("ratings"),timings=timings_obj,tags=data3.get("tags"),price=data3.get("price"),venue_id=data3.get("venueid"),seats=data3.get("seats"),movie_description=data3.get("movie_desc"))
        print(show)
        db.session.add(show)
        db.session.commit()
        print('commited')
        return jsonify("shows successfully added")
    except Exception as e:
        db.session.rollback() 
        print(e)
        return jsonify({"error": str(e)}),500
    
@app.route("/deleteshow/<id>")
def delete_show(id):
    show=Show.query.get(id)
    
    db.session.delete(show)
    db.session.commit()
    return jsonify("card delete")


@app.route("/updateshow/<id>",methods=['POST'])
def update_show(id):
    data1=request.get_json()
    show=Show.query.get(id)
    show.Show_name=data1.get("show_name")
    show.ratings=data1.get("ratings")
    show.tags=data1.get("tags")
    show.price=data1.get("price")
    show.seats=data1.get("seats")
    show.movie_description=data1.get("movie_desc")
    db.session.commit()
    return jsonify("card update")

@app.route("/deletevenue/<int:venueid>", methods=['DELETE'])
def delete_venue(venueid):
    venue = Venue.query.get(venueid)

    if not venue:
        return jsonify("Venue not found"), 404

    # Check if there are associated shows
    if venue.shows:
        return jsonify("Cannot delete venue with associated shows"), 400

    # Delete the venue
    db.session.delete(venue)
    db.session.commit()

    return jsonify("Venue successfully deleted")



@app.route('/user/search/show_name', methods=['POST'])
def search_show():
    if request.method == 'POST':
        post_data = request.get_json()
        city = post_data.get('city')
        show_name = post_data.get('show_name')

        if city is None or show_name is None:
            return jsonify({"error": "City or show_name missing in the request"}), 400

        venues = Venue.query.filter_by(place=city).all()

        if venues:
            results={}
            for venue in venues:
                matching_shows = []
                for show in venue.shows:
                    if show.Show_name==show_name:
                        matching_shows.append(showtojson(show))
                sorted_shows = sorted(matching_shows, key=lambda x: x['timings'])
                results[json.dumps(venuetojson(venue))] = sorted_shows
            return jsonify(results)
        else:
            return jsonify({"error": "No venues found"}), 404
    else:
        return jsonify({"error": "Invalid request method"}), 405












@app.route('/user/search', methods=['GET', 'POST'])
def search():
    if request.method == 'POST':
        post_data = request.get_json()
        city = post_data['city']
        ven = Venue.query.filter(or_(Venue.place.ilike(city))).all()
        aVen = [venuetojson(v) for v in ven]
        if ven:
            s = []
            for venue in ven:
                shows = venue.shows
                sorted_shows = sorted(shows, key=lambda x: x.timings)
                s.append([showtojson(s) for s in sorted_shows])
            d = {}
            for a in range(len(aVen)):
                d[json.dumps(aVen[a])] = s[a]

            return json.dumps(d)
        else:
            print(jsonify({"error": "No venues found"}), 404)
            return jsonify({"error": "No venues found"}), 404
    else:
        return jsonify({"error": "Invalid request method"}), 405
    

    
if __name__=="__main__":
    app.run(debug=True)