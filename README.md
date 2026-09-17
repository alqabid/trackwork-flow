# OpsTrack Dashboard

Build the frontend design and complete product UI specification for a professional enterprise web application called OpsTrack — Applications Support Activity & Handover Management System.

IMPORTANT ARCHITECTURE REQUIREMENT:

This is a Laravel-based application. Laravel is the required core backend framework. Do NOT design the solution as a replacement React/Supabase-only application.

The final application will use:

Laravel for backend/application logic

Laravel Blade for server-rendered views

Tailwind CSS for styling

Alpine.js for lightweight frontend interactions

Supabase PostgreSQL as the database

Laravel authentication/session management

Eloquent ORM

Laravel policies/middleware for authorization

Your role is to help design a polished, modern frontend experience that can be implemented in Laravel Blade/Tailwind.

PROJECT PURPOSE:

OpsTrack is an internal applications support operations platform used by support personnel and supervisors to record, monitor and hand over daily technical activities.

The system must allow personnel to:

Create/record activities.

Update an activity to Done or Pending.

Add remarks when updating an activity.

Capture the personnel responsible for the update.

Automatically record the date and time of every update.

View all activities and their update history for each day.

Make pending activities highly visible for shift/day handover.

Query activity history using custom date ranges.

Authenticate users before granting access.

DESIGN GOALS:

The interface should look like a real enterprise operations platform rather than a generic student CRUD application.

Use a clean, modern, professional SaaS/operations dashboard aesthetic.

Prioritize:

excellent information hierarchy

strong readability

responsive design

intuitive navigation

clear status indicators

accessible forms

useful empty states

subtle animations

professional typography

polished tables

timeline-based activity history

dashboard analytics

excellent mobile responsiveness

Avoid excessive decoration.

The application should feel suitable for an actual IT/application support department.

BRAND:

Product name:
OpsTrack

Subtitle:
Applications Support Operations

Suggested visual direction:

clean professional interface

light background

white cards

subtle borders

restrained shadows

modern typography

compact enterprise tables

clear visual hierarchy

status badges

timeline components

responsive sidebar

Do not make the design look like a generic AI-generated dashboard.

LAYOUT:

Desktop:

Left sidebar navigation.

Top navigation/header containing:

page title

date

search

notifications

user profile menu

Main content area.

Mobile:

Collapsible navigation.

Responsive cards and tables.

NAVIGATION:

Dashboard
Activities
Daily Handover
Reports
Personnel
Categories
Settings

For authorized users only:

User Management

DASHBOARD:

Create a comprehensive operations dashboard.

Top KPI cards:

Today's Activities

Completed

Pending

Overdue

Each card should show:

number

descriptive label

small trend/context indicator

appropriate icon

Main dashboard sections:

Today's Activity Progress

Display completion percentage.

Example:

17 of 24 completed
71% completion

Today's Activities

A professional table containing:

Activity
Assigned To
Category
Priority
Status
Last Updated
Actions

Pending Handover

Show pending activities prominently.

Each pending item should show:

activity title

assigned personnel

last update

latest remark

time

priority

action button

Recent Activity Timeline

Display recent updates chronologically.

Example:

09:42
Abdul Qabid
marked "Daily SMS count comparison" as Done.

10:13
John Doe
marked "Database backup verification" as Pending.

Activity Statistics

Include useful visual reporting such as:

completed vs pending

activities by category

activity volume by day

ACTIVITIES PAGE:

Create a complete activity management page.

Include:

search

status filter

priority filter

category filter

personnel filter

date filter

create activity button

Table columns:

Activity
Category
Priority
Assigned To
Activity Date
Status
Last Updated
Actions

Actions:

View
Edit
Update Status

CREATE ACTIVITY PAGE:

Fields:

Activity title
Description
Category
Priority
Assigned personnel
Activity date
Due date

Buttons:

Create Activity
Cancel

Provide excellent validation/error states.

ACTIVITY DETAIL PAGE:

Create a detailed activity view.

Header:

Activity title
Status
Priority
Assigned personnel

Information section:

Description
Category
Created by
Created date
Due date

Then create a prominent:

ACTIVITY UPDATE

Status selector:

Done
Pending

Remark textarea

Save Update button

Then create an:

ACTIVITY TIMELINE

Every status update should show:

personnel name

avatar/initials

status

remark

date

exact time

Example:

09:05
Abdul Qabid
Started activity

09:42
Abdul Qabid
Status changed to Done

Remark:
SMS count matched the application logs.

The timeline must make it obvious that the system preserves historical updates rather than simply replacing the current status.

DAILY HANDOVER PAGE:

This is a major feature.

Design a page specifically for shift/day handover.

Header:

Daily Handover

Date selector

Summary:

Completed
Pending
Overdue

Then create:

PENDING ACTIVITIES

Every pending activity should show:

Activity
Assigned Personnel
Last Updated
Latest Status
Latest Remark
Priority
Next Action/View

Make pending activities visually prominent without making the interface visually noisy.

Also include:

COMPLETED TODAY

with a compact list/table.

Add:

Previous Day
Today
Next Day

date navigation.

REPORTS PAGE:

Create a professional reporting interface.

Filters:

From Date
To Date
Personnel
Status
Category
Priority

Button:

Generate Report

Results should show:

Total Activities
Completed
Pending
Overdue
Completion Rate

Then:

Activity History table.

Columns:

Date
Activity
Personnel
Category
Status
Remark
Updated At

Include:

pagination

search

export CSV

print report

PERSONNEL PAGE:

Show support personnel in a professional table.

Columns:

Name
Role
Department
Activities
Completed
Pending
Last Activity
Actions

Personnel profile/detail page should show:

Profile information
Activity statistics
Recent activities
Activity history

CATEGORIES PAGE:

Allow authorized users to manage categories.

Examples:

Monitoring
Database
SMS
Application
Server
Network
Incident
Reporting
Maintenance

USER MANAGEMENT:

For administrators.

Show:

Name
Email
Role
Status
Last Login
Actions

Include:

Create User
Edit User
Deactivate User

AUTHENTICATION:

Create a professional login screen.

Brand:

OpsTrack

Subtitle:

Applications Support Operations

Fields:

Email
Password

Button:

Sign In

Include:

Forgot password
Remember me
Validation errors

Do not build authentication as Supabase Auth. The final implementation will use Laravel authentication.

ROLES:

Admin:

manage users

create/edit/delete activities

view all activities

view reports

manage categories

Supervisor:

create activities

assign activities

update activities

view team activities

view reports

view handovers

Support Staff:

view assigned activities

update assigned activities

add remarks

view relevant history

RESPONSIVE DESIGN:

The application must work well on:

desktop

laptop

tablet

mobile

Tables should become responsive cards or horizontally scrollable tables on smaller screens.

UX REQUIREMENTS:

Include:

loading states

empty states

confirmation dialogs

success notifications

error notifications

form validation

disabled button states

clear hover states

keyboard-friendly controls

NON-FUNCTIONAL CONSIDERATIONS:

The UI should support:

security

accessibility

usability

maintainability

responsive design

performance

Do not expose sensitive information.

COMPONENT SYSTEM:

Create reusable UI concepts for:

Button

Input

Select

Textarea

Modal

Badge

Status Badge

KPI Card

Data Table

Pagination

Dropdown

Toast

Timeline

Date Picker

Empty State

Loading Skeleton

Confirmation Dialog

STATUS DESIGN:

Done:
clear positive visual treatment.

Pending:
warning/attention visual treatment.

Overdue:
strong attention treatment.

Priority:

Low
Medium
High
Critical

Make statuses immediately understandable.

IMPORTANT:

Do not invent features unrelated to the assignment.

The core product must remain focused on:

activity tracking,
status updates,
remarks,
personnel identification,
timestamps,
daily activity visibility,
handover management,
historical reporting,
custom date-range reports,
authentication.

The final design should be polished enough to demonstrate strong UI innovation while remaining realistic for an enterprise applications support team.

At the end, provide:

Complete page structure

Reusable component structure

Navigation structure

Responsive behavior

Design system guidance

Data requirements for each page

Suggested Laravel Blade component mapping

Do not replace Laravel with another backend framework.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/10ec06a5-6b4d-4f64-995f-d6fd7f176040).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
