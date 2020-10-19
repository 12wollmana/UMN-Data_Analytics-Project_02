from flask import Flask, jsonify, render_template, abort

app = Flask(__name__)

api_current_version = "v1.0"

routes = {
    "home": "/",
    "api_docs": "/api/<version>",
    "api_versions": "/api"
}

templates = {
    "home": "index.html",
    "api_docs": "api_docs.html",
    "api_versions": "api_versions.html"
}

versionInfos = [
    {
        "name": "v1.0",
        "url": "/api/v1.0",
        "documentation":
            {
                "<year>": [
                    {
                        "case": {
                            "caseNumber": "The case number within the Minneapolis police system.",
                            "isCallTo911": "Whether this case was triggered by a call to 911.",
                            "problem": "The problem this case is for.",
                            "primaryOffence": "The primary offense for this case.",
                            "date": "The date of the case.",
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
                "<cityID>": {
                    "name": "The name of the city.",
                    "summary": {
                        "year": "The year.",
                        "totalCalls": "The total number of calls in the year."
                    }
                },
                "<precinctID>": {
                    "name": "The name of the precinct.",
                    "summary": {
                        "year": "The year.",
                        "totalCalls": "The total number of calls in the year."
                    }
                },
                "<neighborhoodID>": {
                    "name": "The name of the neighborhood.",
                    "summary": {
                        "year": "The year.",
                        "totalCalls": "The total number of calls in the year."
                    }
                }
            }
    }
]


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
    return render_template(templates["api_versions"], versions=versionInfos)


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
    selectedVersionInfo = {}
    for versionInfo in versionInfos:
        if(versionInfo["name"] == version):
            selectedVersionInfo = versionInfo

    documentation = {}
    if selectedVersionInfo:
        documentation = selectedVersionInfo["documentation"]
    else:
        abort(404, "API version is not available.")

    return jsonify(documentation)


if __name__ == "__main__":
    app.run(debug=True)
