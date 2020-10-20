########################################
# IMPORTS
########################################

from sqlalchemy import exc
from config import username, password;

from flask import Flask, jsonify, render_template, abort

from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine;

########################################
# SETUP APPLICATION
########################################

app = Flask(__name__)

engine = create_engine(
    f"postgresql://{username}:{password}@localhost:5432/police_force")
base = automap_base()
base.prepare(engine, reflect=True)

database_tables = base.classes

########################################
# CONSTANTS
########################################

api_current_version = "v1.0"

routes = {
    "home": "/",
    "api_versions": "/api",
    "api_docs": "/api/<version>",
    "api_docs_year" : "/api/<version>/year",
    "api_docs_city" : "/api/<version>/city",
    "api_docs_precinct" : "/api/<version>/precinct",
    "api_docs_neighborhood" : "/api/<version>/neighborhood",
    "api_year" : "/api/<version>/year/<year>",
    "api_city" : "/api/<version>/city/<cityID>",
    "api_precinct" : "/api/<version>/precinct/<precinctID>",
    "api_neighborhood" : "/api/<version>/neighborhood/<neighborhoodID>"
}

templates = {
    "home": "index.html",
    "api_docs": "api_docs.html",
    "api_versions": "api_versions.html"
}

version_infos = [
    {
        "name": "v1.0",
        "url": "/api/v1.0",
        "documentation":
            {
                "/api/v1.0/year/" : "Gets a list of available years.",
                "/api/v1.0/year/<year>": [
                    {
                        "case": {
                            "caseNumber": "The case number within the Minneapolis police system.",
                            "isCallTo911": "Whether this case was triggered by a call to 911.",
                            "problem": "The problem this case is for.",
                            "primaryOffense": "The primary offense for this case.",
                            "date": "The date of the case.",
                            "year": "The year of the case.",
                            "month": "The month of the case.",
                            "day" : "The day of the case.",
                            "hour" : "The hour of the case",
                            "latitude": "The latitude for where the case occured.",
                            "longitude": "The longitude for where the case occured.",
                            "city": {
                                "id": "The city ID for this API",
                                "name": "The city's name."
                            },
                            "precinct": {
                                "id": "The precinct ID for this API",
                                "name": "The precinct's name."
                            },
                            "neighborhood": {
                                "id": "The neighborhood ID for this API",
                                "name": "The neighborhood's name."
                            },
                            "force": {
                                "forceNumber": "The force number within the Minneapolis police system.",
                                "forceReportNumber": "The force report number within the Minneapolis police system.",
                                "forceCategory": "The categorization of the force.",
                                "forceAction": "The action taken by the officer.",
                                "subject": {
                                    "race": "Subject's race.",
                                    "sex": "Subject's sex.",
                                    "age": "Subject's age",
                                    "wasInjured": "Whether the subject was injured",
                                    "role": "The subject's role.",
                                    "roleNumber": "The role number within the Minneapolis police system.",
                                    "resistance": "How the subject resisted the officer."
                                }
                            }
                        }
                    }
                ],
                "/api/v1.0/city/": "Gets a list of available cities.",
                "/api/v1.0/city/<cityID>": {
                    "name": "The name of the city.",
                    "summary": {
                        "year": "The year.",
                        "totalCalls": "The total number of calls in the year."
                    }
                },
                "/api/v1.0/precinct/": "Gets a list of available precincts.",
                "/api/v1.0/precinct/<precinctID>": {
                    "name": "The name of the precinct.",
                    "summary": {
                        "year": "The year.",
                        "totalCalls": "The total number of calls in the year."
                    }
                },
                "/api/v1.0/neighborhood/": "Gets a list of available neighborhoods.",
                "/api/v1.0/neighborhood/<neighborhoodID>": {
                    "name": "The name of the neighborhood.",
                    "summary": {
                        "year": "The year.",
                        "totalCalls": "The total number of calls in the year."
                    }
                }
            }
    }
]


########################################
# ROUTES
########################################

@app.route(routes["home"])
def home():
    """
    The homepage.

    Returns
    -------
    Flask Rendered Template
        The HTML to show.
    """

    return render_template(templates["home"])


@app.route(routes["api_versions"])
def api_versions():
    """
    Shows all versions of the API.

    Returns
    -------
    Flask Rendered Template
        The HTML to show.
    """
    return render_template(
        templates["api_versions"], 
        versions=version_infos
        )


@app.route(routes["api_docs"])
def api_docs(version):
    """
    Shows the documentation for a specific API.

    Parameters
    ----------
    version : string
        The API version to show.

    Returns
    -------
    Flask Rendered Template
        The HTML to show.
    """
    selected_version_info = get_version_info(version)

    documentation = {}
    if selected_version_info:
        documentation = selected_version_info["documentation"]
    else:
        abort(404, "API version is not available.")

    return jsonify(documentation)


@app.route(routes["api_docs_year"])
def api_docs_year(version):
    selected_version_info = get_version_info(version)
    available_years = {}
    if(selected_version_info):
        available_years = load_available_years()
    else:
        abort(404, "API version is not available.")

    return jsonify(available_years)

@app.route(routes["api_year"])
def api_year(version, year):
    selected_version_info = get_version_info(version)

    year_data = {}
    if selected_version_info:
        year_data = load_year_data(year)
    else:
        abort(404, "API version is not available.")

    return jsonify(year_data);

@app.route(routes["api_docs_city"])
def api_docs_city(version):
    selected_version_info = get_version_info(version)

    available_cities = {}
    if selected_version_info:
        available_cities = load_available_cities()
    else:
        abort(404, "API version is not available.")

    return jsonify(available_cities);


########################################
# HELPER FUNCTIONS
########################################

def get_version_info(api_version):
    selected_version_info = {}
    for version_info in version_infos:
        if(version_info["name"] == api_version):
            selected_version_info = version_info
    return selected_version_info;

def load_available_cities():
    city_table = database_tables.city

    session = Session(engine)
    available_city_results = session.query(
        city_table.city_id,
        city_table.city_name
    ).all()

    city_ids = []
    for result in available_city_results:
        city_ids.append(
            {
                "cityID": result.city_id,
                "name": result.city_name
            })

    return {
        "availableCities" : city_ids
    }

def load_available_years():
    case_table = database_tables.case

    session = Session(engine)
    available_year_results = session.query(
        case_table.year
    ).distinct()

    years = []
    for result in available_year_results:
        years.append(result.year)
    years.sort()
    session.close()
    return {"availableYears" : years}

def load_cases_by_year(session, year):
    case_table = database_tables.case

    cases_by_year_results = session.query(
        case_table.case_number,
        case_table.is_911_call,
        case_table.problem,
        case_table.primary_offense,
        case_table.date,
        case_table.year,
        case_table.month,
        case_table.day,
        case_table.hour,
        case_table.latitude,
        case_table.longitude,
        case_table.city_id,
        case_table.precinct_id,
        case_table.neighborhood_id,
        case_table.police_force_id
        ).filter(case_table.year == year)

    return cases_by_year_results

def load_city_by_id(session, city_id):
    city_table = database_tables.city

    results = session.query(
        city_table.city_id,
        city_table.city_name
    ).filter(
        city_table.city_id == city_id)

    city_result = results[0]

    return {
        "id" : city_result.city_id,
        "name" : city_result.city_name
    }

def load_precinct_by_id(session, precinct_id):
    precinct_table = database_tables.precinct

    results =  session.query(
        precinct_table.precinct_id,
        precinct_table.precinct_name
    ).filter(
        precinct_table.precinct_id == precinct_id)

    precinct_result = results[0]

    return {
        "id" : precinct_result.precinct_id,
        "name" : precinct_result.precinct_name
    }

def load_neighborhood_by_id(session, neighborhood_id):
    neighborhood_table = database_tables.neighborhood

    results = session.query(
        neighborhood_table.neighborhood_id,
        neighborhood_table.neighborhood_name
    ).filter(
        neighborhood_table.neighborhood_id == neighborhood_id)

    neighborhood_result = results[0]

    return {
        "id" : neighborhood_result.neighborhood_id,
        "name" : neighborhood_result.neighborhood_name
    }

def load_police_force_by_id(session, force_id):
    force_table = database_tables.police_force

    results = session.query(
        force_table.force_number,
        force_table.force_category_id,
        force_table.force_action,
        force_table.force_report_number,
        force_table.subject_id
    ).filter(
        force_table.police_force_id == force_id
    )

    force_result = results[0]

    force_category = {}
    force_category_id = force_result.force_category_id
    try:
        force_category = load_force_category_by_id(
            session, 
            force_category_id
        )
    except IndexError:
        abort(
            404,
            f"Unable to load force category {force_category_id} for force id {force_id}"
        )

    subject = {}
    subject_id = force_result.subject_id
    if(subject_id):
        try:
            subject = load_subject_by_id(
                session,
                subject_id
            )
        except IndexError:
            abort(
                404,
                f"Unable to load subject with id {subject_id} for force id {force_id}"
            )
    return {
        "forceNumber" : force_result.force_number,
        "forceReportNumber" : force_result.force_report_number,
        "forceCategory" : force_category["category"],
        "forceAction" : force_result.force_action,
        "subject" : subject
    }

def load_force_category_by_id(session, force_category_id):
    force_category_table = database_tables.force_categories

    results = session.query(
        force_category_table.force_category_id,
        force_category_table.category
    ).filter(
        force_category_table.force_category_id == force_category_id
    )

    force_category_result = results[0]

    return {
        "id" : force_category_result.force_category_id,
        "category" : force_category_result.category
    }

def load_subject_by_id(session, subject_id):
    subject_table = database_tables.subject

    results = session.query(
        subject_table.race,
        subject_table.sex,
        subject_table.age,
        subject_table.has_injury,
        subject_table.role,
        subject_table.role_number,
        subject_table.resistance
    ).filter(
        subject_table.subject_id == subject_id
    )

    subject_result = results[0]

    return {
        "race" : subject_result.race,
        "sex" : subject_result.sex,
        "age" : subject_result.age,
        "wasInjured" : subject_result.has_injury,
        "role" : subject_result.role,
        "role_number" : subject_result.role_number,
        "resistance" : subject_result.resistance
    }

def load_year_data(year):
    all_year_data = [];

    session = Session(engine)

    cases_by_year_results = load_cases_by_year(session, year)
    
    for case_result in cases_by_year_results:
        case_number = case_result.case_number

        city_id = case_result.city_id
        city_data = {}
        if(city_id):
            try:
                city_data = load_city_by_id(
                    session, 
                    city_id)
            except IndexError:
                abort(404, 
                f"Unable to load city with id {city_id} for case {case_number}.")

        precinct_id = case_result.precinct_id
        precinct_data = {}
        if(precinct_id):
            try:
                precinct_data = load_precinct_by_id(
                    session, 
                    precinct_id)
            except IndexError:
                abort(404, 
                f"Unable to load precinct with id {precinct_id} for case {case_number}.")

        neighborhood_id = case_result.neighborhood_id
        neighborhood_data = {}
        if(neighborhood_id):
            try:
                neighborhood_data = load_neighborhood_by_id(
                    session, 
                    neighborhood_id)
            except IndexError:
                abort(404, 
                f"Unable to load neighborhood with id {neighborhood_id} for case {case_number}.")

        force_id = case_result.police_force_id
        force_data = {}
        if(force_id):
            try:
                force_data = load_police_force_by_id(
                    session,
                    force_id
                )
            except IndexError:
                abort(
                    404,
                    f"Unable to load police force with id {force_id} for case {case_number}."
                )


        case_data = {
            "caseNumber" : case_result.case_number,
            "isCallTo911" : case_result.is_911_call,
            "problem" : case_result.problem,
            "primaryOffense" : case_result.primary_offense,
            "date" : case_result.date,
            "year" : case_result.year,
            "month" : case_result.month,
            "day" : case_result.day,
            "hour" : case_result.hour,
            "latitude" : case_result.latitude,
            "longitude" : case_result.longitude,
            "city" : city_data,
            "precinct" : precinct_data,
            "neighborhood" : neighborhood_data,
            "force" : force_data
        }

        all_year_data.append({"case" : case_data})

    session.close();
    return all_year_data;


########################################
# RUN FLASK
########################################
if __name__ == "__main__":
    app.run(debug=True)
