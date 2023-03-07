# Team 19 Project
    App name = PalCal
    
# Team Overview
	Paige Carlson  = phcarlson
	Ananya Gurjar = ananyagurjar
	Adin Klotz = adinklotz
	Amey Mirchandani = AmeyMirchandani 
  
# Innovative Idea
Our idea is to provide a web application that allows you to form a private group of friends, add your weekly course schedule, and autogenerate a schedule of the group members’ mutual free time. This ideally would entail a “heat map” aspect to the overlapping time slots: green is entirely open, orange is a medium ratio of free availability based on the size of the group, and red or grayed out is entirely busy. Then an event can be booked, where people are able to RSVP. 

As the application includes more nice-to-haves, we would allow for more flexibility in adding to your personal schedule. We would also emphasize the entertainment aspect of the application, where you could add subscriptions to streaming services to your profile to coordinate who can provide what movie. Additionally we could access movie times available in theaters at a certain time slot. This web application is similar to When2meet, which only schedules a singular event. Also Google Calendar. Ours takes the extra step to relate to students and their friends, include repeat schedules, and hopefully have an entertainment focus. 

# Data
1. Busy events (e.g. classes) - the application stores your course schedule so it can be compared with those of your groupmates. A schedule consists of a set of events, each of which has a recurring weekday or specific date, start and end times, and name
2. Groups - users have the ability to create and join groups with other users. A group has a name and a set of members, and is used to coordinate schedules among its members
3. Friends list - each user has a list of friends. The friends list consists of a set of other users. Users can form groups by picking users from their saved friends.
4. Planned events - users can propose times to meet based on the free time determined by their respective calendars. Planning an event involves a date, time range, name, and description. Users can RSVP to a planned event, and it would display who is going

# Functionality
1. Create Account/your profile:
	First, you will create an initial account which includes a basic profile of your name & avatar.
2. Add Class Schedule:
	You will input your weekly class schedule, either through inputting the times of each class on each day, or some kind of calendar import API.
3. Add Friends:
	Send and/or receive friend requests which can be accepted.
4. Create Group:
	You can create a (friend) group which you can add friends to.
	The group pulls from each participant/friend’s schedule to generate an overlapping schedule to highlight free times across the friend group.
5. Suggest/Add event on group calendar:
	RSVPs.
6. Possible movie schedule integration:
	As a possible extra feature if time allows, we would like to integrate with e.g. fandango API to see what movie times all group members can make it to.

# License
MIT License: https://opensource.org/licenses/MIT
