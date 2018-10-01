# Item Catalog Project 4


## About
Project four of the Udacity Full Stack Nanodegree, Item Catalog. The application is a simple RESTful CRUD application using the flask framework

## Some things you might need
- [Vagrant](https://www.vagrantup.com/)
- [Udacity Vagrantfile](https://github.com/udacity/fullstack-nanodegree-vm)
- [VirtualBox](https://www.virtualbox.org/wiki/Downloads)

## Getting Started

- Install Vagrant and VirtualBox
- Clone the Vagrantfile from the Udacity Repo
- Clone this repo into the `project_4` directory found in the Vagrant directory
- Run `vagrant up` to run the virtual machine, then `vagrant ssh` to login to the VM
- from the main directory run `sudo pip install -r requirements`
- run db_setup.py with `python db_setup.py`
- run application with `python project.py` from within its directory
- go to `http://localhost:5000/categories` to access the application
- *if first time running, you must add a category before adding an item


## JSON Endpoints

`/api/v1/catalog.json` - Returns JSON of all items in catalog

`/api/v1/categories/<int:category_id>/item/<int:catalog_item_id>/JSON` - Returns JSON of selected item in catalog

`/api/v1/categories/JSON` - Returns JSON of all categories in catalog


## REST Endpoints

#### Categories


`/` or `/categories` - Returns catalog page with all categories and recently added items

`/categories/new` - Allows user to create new category

`/categories/<int:category_id>/edit/` - Allows user to edit an existing category


`/categories/<int:category_id>/delete/` - Allows user to delete an existing category


#### CRUD for catalog items


`/categories/<int:category_id>/` or `/categories/<int:category_id>/items/` - returns items in category

`/categories/<int:category_id>/item/<int:catalog_item_id>/` - returns category item

`/categories/item/new` - Allows user to create a new item

`/categories/<int:category_id>/item/<int:catalog_item_id>/edit` - Allows user to edit an item


`/categories/<int:category_id>/item/<int:catalog_item_id>/delete` - Allows user to delete an item

#### Login


`/login` - login page

