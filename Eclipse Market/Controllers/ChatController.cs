﻿using Eclipse_Market.Models.DB;
using Eclipse_Market.Models.Request;
using Eclipse_Market.Models.Response;
using Eclipse_Market.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System.Data.Entity;
using System.Reflection.Metadata.Ecma335;

namespace Eclipse_Market.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private EclipseMarketDbContext _dbContext;
        public IConfiguration Configuration { get; }
        public IJwtService JwtService { get; set; }
        public ChatController(EclipseMarketDbContext dbContext, IConfiguration configuration, IJwtService jwtService)
        {
            _dbContext = dbContext;
            Configuration = configuration;
            JwtService = jwtService;
        }

        [HttpGet]
        public ActionResult<List<ChatGetAllResponse>> GetAll()
        {
            var chats = _dbContext.Chats
                .Include(x => x.Participants)
                .Include(x => x.Messages)
                .Select(x => new ChatGetAllResponse()
                {
                    Id = x.Id,
                    TimeStarted = x.TimeStarted,
                    TopicListingId = x.TopicListingId
                }).ToList();

            foreach (var chat in chats)
            {
                chat.ParticipantIds = _dbContext.UserChats
                    .Where(x => x.ChatId == chat.Id).Select(x => x.UserId);
                chat.MessageIds = _dbContext.Messages
                    .Where(x => x.ChatId == chat.Id).Select(x => x.Id);
            }

            return Ok(chats);
        }
        [HttpGet]
        public ActionResult<ChatGetByIdResponse> GetById(int? id)
        {
            var chat = _dbContext.Chats
                .Include(_ => _.Participants)
                .Include(_ => _.Messages)
                .FirstOrDefault(x => x.Id == id);

            if(chat == null)
            {
                return BadRequest(ErrorMessages.InvalidId);
            }

            var response = new ChatGetByIdResponse()
            {
                TimeStarted = chat.TimeStarted,
                TopicListingId = chat.TopicListingId,
                ParticipantIds = chat.Participants.Select(x => x.UserId),
                MessageIds = chat.Messages.Select(x => x.Id)
            };

            return Ok(response);
        }

        [HttpPost]
        public ActionResult Create(ChatCreateRequest request)
        {
            var sender = _dbContext.Users.First(x => x.Id == JwtService.GetUserIdFromToken(User));

            var listingOfSender = _dbContext.Listings.FirstOrDefault(x => x.Id == request.TopicListingId);

            if(listingOfSender == null)
            {
                return BadRequest(ErrorMessages.InvalidId);
            }

            var receiver = listingOfSender.Author;
            List<UserChat> participants = new List<UserChat>();
            participants.Add(new UserChat { UserId = sender.Id, User = sender });
            participants.Add(new UserChat { UserId = receiver.Id, User = receiver });
            var chatToAdd = new Chat
            {
                Participants = participants,
                TimeStarted = DateTime.UtcNow.ToString(),
                TopicListingId = request.TopicListingId
            };
            _dbContext.Chats.Add(chatToAdd);
            _dbContext.SaveChanges();
            return Ok();

        }

        [HttpDelete]
        public ActionResult Delete(int? id)
        {
            var chat = _dbContext.Chats.FirstOrDefault(x => x.Id == id);

            if(chat == null)
            {
                return BadRequest(ErrorMessages.InvalidId);
            }

            _dbContext.Chats.Remove(chat);
            _dbContext.SaveChanges();

            return Ok();
        }
    }
}
