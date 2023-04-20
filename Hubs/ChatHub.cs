﻿using Eclipse_Market.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Eclipse_Market.Models.DB;
using Microsoft.CodeAnalysis;
using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Eclipse_Market.Models.Request;

namespace Eclipse_Market.Hubs
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ChatHub : Hub
    {
        private EclipseMarketDbContext _dbContext;
        public ChatHub(EclipseMarketDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async override Task OnConnectedAsync()
        {
            await AddUserToGroups();
            await MapUserToConnection();
            await base.OnConnectedAsync();
        }
        
        public override Task OnDisconnectedAsync(Exception? exception)
        {
            var chatHubConnectionToRemove = _dbContext.ChatHubConnections
                .Where(x => x.UserId == GetUserId() &&
                x.IsConnected == true &&
                x.ConnectionId == GetConnectionId() &&
                x.UserAgent == GetUserAgent().ToString())
                .FirstOrDefault();
            if(chatHubConnectionToRemove is null)
            {
                throw new Exception();
            }
            _dbContext.ChatHubConnections.Remove(chatHubConnectionToRemove);
            _dbContext.SaveChanges();
            return base.OnDisconnectedAsync(exception);
        }
        private async Task MapUserToConnection()
        {
            if(!_dbContext.Users.Any(x => x.Id == GetUserId()))
            {
                throw new Exception();
            }
            _dbContext.ChatHubConnections.Add(new ChatHubConnection
            {
                ConnectionId = GetConnectionId(),
                IsConnected = true,
                UserAgent = GetUserAgent(),
                UserId = GetUserId(),
                User = _dbContext.Users.Where(x => x.Id == GetUserId()).First()
            });
            await _dbContext.SaveChangesAsync();
        }
        private async Task AddUserToGroups()
        {
            int userId = GetUserId();
            var chatIdsOfUser = _dbContext.UserChats
                .Where(x => x.UserId == userId)
                .Select(x => x.ChatId)
                .ToList();

            foreach (int chatId in chatIdsOfUser)
            {
                await Groups.AddToGroupAsync(GetConnectionId(), chatId.ToString());
            }
        }
        private int GetUserId()
        {
            return int.Parse(Context.User.Identity.Name);
        }
        private string GetConnectionId()
        {
            return Context.ConnectionId;
        }
        private string GetUserAgent()
        {
            return Context.GetHttpContext().Request.Headers.UserAgent.ToString();
        }
    }
}
