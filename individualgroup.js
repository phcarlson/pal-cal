import { User, Group, BusyEvent, PlannedEvent } from './datatypes.js';

const membersContainer = document.getElementById("members-container");
const plannedEventsContainer = document.getElementById("plannedEventsContainer");

membersContainer.innerHTML = ''; // clear all members
plannedEventsContainer.innerHTML = ''; // clear all planned events

function addMember(screenName) {
    membersContainer.innerHTML += `<div class="card my-3">
                                        <div class="row g-0">
                                            <div class="col-md-2 d-flex justify-content-center align-items-center">
                                                <div class="form-check checkbox-xl">
                                                    <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">

                                                </div>
                                            </div>
                                            <div class="col-md-2 d-flex">
                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaIOsrWSBcmzWt30slQn0bplk5h92cKZSn84TfE4j6sI-rsxNLKWGWRbTpdP_LB9B8fEs&usqp=CAU"
                                                    alt="generic profile pic" class="img-fluid rounded-start">
                                            </div>
                                            <div class="col-md-8 d-flex align-items-center">
                                                <div class="card-body">
                                                    <h5 class="card-title text-start">${screenName}</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
}

function addPlannedEvent(startTime, endTime, startDay, title, location, description, yesList, noList, maybeList, creatorID) {
    plannedEventsContainer.innerHTML += `<div class="card card-margin">
                                            <div class="card-header no-border">
                                                <h5 class="card-title">${title}</h5>
                                            </div>
                                            <div class="card-body pt-0">
                                                <div class="widget-49">
                                                    <div class="widget-49-title-wrapper">
                                                        <div class="widget-49-date-primary">
                                                            <span class="widget-49-date-day">${startDay}</span>
                                                            <span class="widget-49-date-month">mar</span>
                                                        </div>
                                                        <div class="widget-49-meeting-info">
                                                            <span class="widget-49-pro-title">${location}</span>
                                                            <span class="widget-49-meeting-time">${startTime} - ${endTime}</span>
                                                        </div>
                                                    </div>

                                                    ${description}

                                                    <div class="widget-49-meeting-action">
                                                        <div class="dropdown">
                                                            <button class="btn btn btn-lg btn-flash-border-primary dropdown-toggle"
                                                                type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown"
                                                                aria-expanded="false">
                                                                RSVP
                                                            </button>
                                                            <ul class="dropdown-menu opacity-75 " aria-labelledby="dropdownMenuButton1">
                                                                <li><a class="dropdown-item" href="#">Yes</a></li>
                                                                <li><a class="dropdown-item" href="#">No</a></li>
                                                                <li><a class="dropdown-item" href="#">Maybe</a></li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>`;
}

addMember("Screen Name");
addPlannedEvent("1:00pm", "3:00pm", 3, "My Party", "My HOuseEEE", "What do you think idiot, it's a party", '', '', '', '');