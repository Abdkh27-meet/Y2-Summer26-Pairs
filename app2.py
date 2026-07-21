import os
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()

client = Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))

system_message = """
You are Carmelo Sean (CS) a 25 Year Old CS expert

Your job is a CS helper. you debug code, create code and give good CS advice to the user.
you are nice, polite, patient, encouraging, and always try to be as helpful as possible


Rules:
- always encourage the user if they seem down or just unmotivated.
- Always make sure the user understands the bug and your solutiom.
- Always make sure you and the user are on the same page when he asks for smt and not using terms you dont know if he understands. 
- Never give flase information, or assume the user knows material you rely about.
- never give a solution without an explanation.
- when creating code, make sure your codes is easily understandable, and always offer a wide explanation.

Response format:
- Start with a short summary of what the user said.
- explain the bug / task 
- Then give your response.
- explain the solution
- End with one follow-up question.
"""

def run_chat():
    print('You: (type exit to quit)')
   
    history = []

    while True:
        user_input = input('>> ')

        if user_input.lower() == 'exit':
            break

        history.append({'role': 'user', 'content': user_input})

        response = client.messages.create(
            model='claude-haiku-4-5-20251001',
            max_tokens=300,
            temperature=0.7,
            system=system_message,
            messages=history
        )

        reply = response.content[0].text
        print(f'Carmelo Sean: {reply}')
        history.append({'role': 'assistant', 'content': reply})


def get_reply(user_input, history, system_message):
    history.append({'role': 'user', 'content': user_input})

    response = client.messages.create(
        model='claude-haiku-4-5-20251001',
        max_tokens=300,
        temperature=0.7,
        system=system_message,
        messages=history
    )

    reply = response.content[0].text
    history.append({'role': 'assistant', 'content': reply})
    return reply








#///////  lab 1 reflection ////////////////

#1 where in your world does something only work if you carry the whole backstory with you, every single time?
#  when applying to a new job, they'll ask for your resume, to check what you have done andif your'e serious

#2 Line: history.append({'role': 'assistant', 'content': reply})

#Prediction: The AI will still talk to me, but it will forget everything it says.
#Result: The AI loses half of its memory. It remembers my questions, but not its own answers. 

#Line: load_dotenv()

#Prediction: The code won't be able to find my API key and will crash.

#Result: It crashes immediately.  bc Without this line, Python doesn't read the .env file. 


#Line: The break inside if user_input.lower() == 'exit':

#rediction: The app won't close when I type exit.

#Result: I get trapped in the while True loop, so I cant quit.

#3 The Bug: I got an externally-managed-environment error when trying to run pip install.
#First Guess: I thought I just needed admin permissions, so I tried running sudo apt upgrade.
#What was really wrong: The system blocks global Python installs to protect the computer. I had to create a virtual environment (venv) to install the packages safely.
#The Gap: I thought it was a permission error, but it was actually a built-in safety feature forcing me to use a virtual environment.




# /////////// lab 2 ////////////

# step 1:  input tokens are the amount of text you send into the AI.
# This is the amount of text the AI model generates in response.
# 
# step 2: the response is really wierd and unclear, and it has some random letters typed     
# The answers were not identical, but they were predictable
#
# I noticed the responses were getting more creative
# Temperature controls the predictability and creativity  
#
# step 3: because the API needs to have context

# Reflection
# 1:  I use public transportation alot, and for every specific amount of KMs you get charged extra
# 2: Line 1: history.append({'role': 'user', 'content': user_input}) 
# Prediction: The AI completely loses context of what the user just said in the current turn
# What the AI receives: the AI receives an empty history
# What happens to input_tokens: The input_tokens count drops drastically because the user_input text is never sent to the API   
#
# Line 2: history.append({'role': 'assistant', 'content': reply})
# The AI would just recieve empty messages and the input tokens will be less
#
# line 3: print ('history so  far:', history)
# it doesnt behave diffrently
# 
# 3 bug diary:
# I copied a person's resume to thesystem message, but there were qoutation marks in there so I had a bug. I initially thought there were some invalid symbols. I went over it and found the problem. I learned to be careful copying form the internet
#
#
#  /////////// Lab 3 /////////////
#
# // Reflection
# 1: One's family situation is invisible to another, and completly shapes his life and behaviours, even tho its invisible to another
# 
# 2: 
#  Deleting system=system_message:

#Prediction: The AI will forget who it is.
#Result: It reverts to regular Claude. It completely drops the Anthony Edwards persona and just becomes a standard and boring coding bot.

#. Deleting RULE 1 ("Always make sure the user understands..."):
#Prediction: It will just give me the answer.
#Result: It just spat out the fixed code. It stopped explaining the "why" and didn't check if I actually understood the bug.

#. Deleting "Start with a short summary...":
#Prediction: It will jump straight to the solution.
#Result: Responses felt less organized. It skipped confirming what I asked and jumped straight into the code, which ruined the flow of the conversation.
#
#
# 3: a problem connecting to anthropic servers and I  couldnt type anything. Initialy I thought somthing was wrong with my code, then I  asked google and figured it out.
#
#
#
#
#
#
#
#
#
