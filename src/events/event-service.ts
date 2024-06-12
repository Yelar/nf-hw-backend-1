import { CreateEventDto } from './dtos/CreateEvent.dot';
import { Event } from './types/response';
import mongoose from 'mongoose';
import EventModel, {IEvent} from './models/Event';


// this event service instance shows how to create a event, get a event by id, and get all events with in-memory data
class EventService {
    async getEventById(id: string): Promise<Event | IEvent | null> {
      return EventModel.findById(id).exec();
    }
    async getEvents(limit: number, page: number): Promise<(Event | IEvent)[]> {
      return EventModel.find().limit(limit).skip(page-1).exec();
    }
  
    async createEvent(createEventDto: CreateEventDto): Promise<IEvent> {
      const { name, description, date, location ,duration} = createEventDto;
      const newEvent = new EventModel({
        name,
        description,
        date: new Date(date),
        location,
        duration
      });
  
      await newEvent.save();
      return newEvent;
    }
  }
  
  export default EventService;
  