﻿namespace Eclipse_Market.Models.Response
{
    public class ListingGetWithoutAuthorResponse
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public double Price { get; set; }
        public string Location { get; set; }
        public int Views { get; set; }
        public int TimesBookmarked { get; set; }
        public int ListingCategoryId { get; set; }
    }
}
