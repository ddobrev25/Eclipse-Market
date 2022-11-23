﻿namespace Eclipse_Market.Models.Response
{
    public class ChatGetAllByUserIdResponse
    {
        public int Id { get; set; }
        public string TimeStarted { get; set; }
        public string TopicListingTitle { get; set; }
        public string TopicListingImageBase64String { get; set; }
        public int TopicListingAuthorId { get; set; }
        public IEnumerable<int> MessageIds { get; set; }
        public IEnumerable<int> ParticipantIds { get; set; }
    }
}
