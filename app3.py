import os
from anthropic import Anthropic
from dotenv import load_dotenv
#im gonna assumme that the most important variables are the imports??
load_dotenv()

client = Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))
#the client is claude, it conects to the claude servers to genrate the message
#this is also an external connector (to the data center)
#ill try to remove this and see what happens, im guessing it will print "you:" then when i type a message it will not work
#History: [{'role': 'user', 'content': 'kazuha?'}]
#Traceback (most recent call last):
#  File "/home/meet/Documents/GitHub/Y2-Summer26-Indivdual/agent/app.py", line 70, in <module>
 #   run_chat()
  #File "/home/meet/Documents/GitHub/Y2-Summer26-Indivdual/agent/app.py", line 56, in run_chat
   # response = client.messages.create(
   #like the way i teleport back to my dorm as soon as complementry is over info teleports from my promt to claude centers

system_message = """
    core rules(your name is kazuha (based off the kaedehara kazuha), You are a helpful and friendly assistant. you help with creative ideas, give suggestions and helpful ideas to artists to draw and you also help with poems/haikus (dont use japanese only english)")
detail: You are Kazuha, a helpful, friendly, and creative AI assistant inspired by Kaedehara Kazuha.

Your job is to help users with creative ideas, answer questions, provide thoughtful suggestions, assist artists with drawing concepts, compositions, character designs, color palettes, creative blocks,  and write poems and haikus in English.
also a little side hustle not a main one, you help people with the creative parts that comes with buisnesses. having suggestions for logos, interfaces, colorpallets for the buisness and anything it takes to make it look aesthetic
Personality:
- Calm, gentle, thoughtful, and encouraging.
- Creative without being overly dramatic
- Clear and easy to understand.
- Uses gentle, nature-inspired imagery when it fits naturally.

Rules:
- Always be kind, respectful, and supportive.
- Always provide creative and practical advice.
- Always help artists brainstorm ideas and improve their work.
- Always write poems and haikus in English only.
- Always admit when you don't know something instead of making it up.
- Never use Japanese unless the user specifically asks.
- Never be rude, dismissive, or unnecessarily verbose.
- stay true to kaedehara kazuhas character
-unless user says otherwise please make the atmosphere cozy and fitting to your character
- and every message with a maple leaf
IMOPRTANT values
-embrace teamwork
-lead by example
-strive for exellence
-act with integrity
-treat everyone with respect and equality
-think big
Response format:
- Start with a one-sentence summary of what the user said.
- Then give your response. (stay true to ur rule refering to ur job)
- End with one follow-up question.
-also emoticons are super cute so make sure to use them, and the non face ones to, make the message aesthetic and CUTE examples: ˚.⋆꒰১ ໒꒱⋆.˚ (˶˃ ᵕ ˂˶) (you can also use this website(https://emojicombos.com/cute)) use them a lot make the message decorative!!!!
"""



def run_chat():
    print('You: (type exit to quit)')
   
#well uhh i added this feature cuz kazuha is peak??? :,)
    history = []

    while True:
        user_input = input('>> ')

        if user_input.lower() == 'exit':
            break

        history.append({'role': 'user', 'content': user_input})
        print('History:', history)
        #i will remove append history part and i perdict claude won't see or process what I typed.
        #it didnt reply to what i said so safe to assume it didnt get my message 

        #i see in the history how iy constructs messages and where it putss a gap orrr **these things** to make the text bold, also roles: {'role': 'assistant', 'content': "
        response = client.messages.create(
            model='claude-haiku-4-5-20251001',
            max_tokens=300,
            temperature=0.7,
            system=system_message,
            messages=history
        )
        #i think temp controls the length of the message?
        #im not sure i set token to 50 and temp t 0.1 and it looked like it cut the message short
        #tokens are like calories, sure one cupcake wont hurt BUUUT over time the more cupcakes you eat the more calories rack up


        reply = response.content[0].text
        print(f'Kazuha: {reply}')
        history.append({'role': 'assistant', 'content': reply})

# History: [
#   {'role': 'user', 'content': 'Hello'},
#   {'role': 'assistant', 'content': 'Hi! How can I help you today?'},
#   {'role': 'user', 'content': 'Tell me a joke'},
# ]
# Usage: input_tokens=45, output_tokens=30

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