﻿namespace Eclipse_Market.Models.DB
{
    public class Chat
    {
        public int Id { get; set; }
        public DateTime TimeStarted { get; set; }
        public int TopicListingId { get; set; }
        public List<Message> Messages { get; set; }
    }
}
