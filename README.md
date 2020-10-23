# Use of Police Force in Minneapolis
<em>Aaron Wollman, Kelsey Richardson Blackwell, Will Huang, Mark Erickson</em>

{Project Description}


## Project Proposal
[Link to Project Proposal](https://docs.google.com/document/d/1S8f17_1JH-xNafa9AJuODPuJU724BTAQOyuVbggtQM4/)

## How to Run
### Configuration Files
#### Javascript
<ol>
  <li>
    Navigate to static > js.
  </li>
  <li>
    Make a copy of <strong>config.template.js</strong> in the js directory.
	</li>
	<li>
    Rename this file to <strong>config.js</strong>.
	</li>
	<li>
	Edit the file, replacing the variables with the proper values.
	</li>
</ol>

#### Python
<ol>
  <li> 
    Make a copy of <strong>config.template.py</strong> in the root directory of this project. (UMN-Data_Analytics-Project_02)
  </li>
  <li>
    Rename this file to <strong>config.py</strong>.
  </li>
  <li>
	  Edit the file, replacing the variables with the proper values.
	</li>
</ol>

### Setup Database
For the database, this project uses a PostgresSQL database for storing police force data.
This database needs to be created and populated by following the steps below.

#### Create Schema
<ol>
  <li>
    Open an instance of pgAdmin.
  </li>
  <li>
		Create a PostgresSQL database and name it police_force.
	</li>
  <li>
    Run <strong>database/queries/create.sql</strong> to generate the tables within the new database.
  </li>
  <li>
		In the sidebar under the database that ran create.sql, open Schemas > public > Tables.
		There should be 10 tables:
        <ul>
          <li>case</li>
          <li>city</li>
          <li>city_summary</li>
          <li>force_categories</li>
          <li>neighborhood</li>
          <li>neighborhood_summary</li>
          <li>police_force</li>
          <li>precinct</li>
          <li>precinct_summary</li>
          <li>subject</li>
        </ul>
         A refresh might be required by Right Click > Refresh.
	</li>
</ol>

Here is what the database should look like:
<img src="database/uml/uml.PNG" alt="Schema">

If something goes wrong and you need to redo these instructions, make sure to run <strong>database/queries/delete.sql</strong> before the above instructions so that the tables are cleared and deleted.

#### Populate Database
Utilize Jupyter Notebook Environment to do ETL process.
<ol>
  <li>
    Open a command prompt (for windows) or terminal (for mac), change directory to <strong>./database/etl</strong> and run <strong>jupyter notebook</strong> as the command.
  </li>
  <li>
    Run <strong>etl.ipynb</strong> under jupyter notebook environemnt.
  </li>
  <li>
    Hit the dobule arrow <strong>restrat the kernel, then re-run the whole notebook (with dialog)</strong> and click <strong> "Restart and Run All Cells"</strong> to process the whole ETL process.
  </li>
  The last dialog should show something like this if the ETL process has been run successfully:
  <img src="database/uml/etl.PNG">

</ol>

## Sources
Police force data from [Open Minneapolis](https://opendata.minneapolismn.gov/datasets/police-use-of-force).
