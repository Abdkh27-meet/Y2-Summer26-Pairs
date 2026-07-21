import os
from dotenv import load_dotenv
from anthropic import Anthropic

load_dotenv()

client = Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))

from app1 import get_reply as entropo_reply, system_message as entropo_system, save_specific_content_to_pdf
from app2 import get_reply as cs_reply, system_message as cs_system
from app3 import get_reply as kazuha_reply, system_message as kazuha_system

# Each agent gets its own history so their memories don't mix
entropo_history = []
cs_history = []
kazuha_history = []

print("Type @entropo, @cs, or @kazuha to start chatting with that agent.")
print("Once inside a chat, type 'exit' to leave and pick a different agent.")
print("Type 'exit' here at the main menu to quit completely.\n")

while True:
    user_input = input('>> ')

    if user_input.lower() == 'exit':
        print("Goodbye!")
        break

    # Figure out which agent to enter, based on the @tag
    if user_input.lower() == '@entropo':
        agent_name = "Entropo"
        reply_func = entropo_reply
        history = entropo_history
        system_message = entropo_system
    elif user_input.lower() == '@cs':
        agent_name = "Carmelo Sean"
        reply_func = cs_reply
        history = cs_history
        system_message = cs_system
    elif user_input.lower() == '@kazuha':
        agent_name = "Kazuha"
        reply_func = kazuha_reply
        history = kazuha_history
        system_message = kazuha_system
    else:
        print("Please type @entropo, @cs, or @kazuha to start a chat.")
        continue

    print(f"\n--- Now chatting with {agent_name}. Type 'exit' to leave this chat. ---\n")
    if agent_name == "Entropo":
        print("You can also type 'save: <topic>' to save a specific answer as a PDF, e.g. 'save explain customer discovery'.\n")
    # Inner loop: stay in this agent's chat until the user types exit
    while True:
        message = input('user: >> ')

        if message.lower() == 'exit':
            print(f"--- Left {agent_name}'s chat. Back to the main menu. ---\n")
            break

        # NEW: check for the save command before sending to the agent
        if message.lower().startswith('save'):
            topic = message[4:].strip()  # cuts off "save", leaving just the topic

            if not topic:
                print('Please tell me what to save, e.g. "save explain customer discovery"')
                continue

            # Ask the CURRENT agent to answer this one topic, separate from the ongoing history,
            # so nothing else from the conversation ends up in the PDF
            response = client.messages.create(
                model='claude-haiku-4-5-20251001',
                max_tokens=300,
                temperature=1,
                system=system_message,
                messages=[{'role': 'user', 'content': topic}]
            )
            content_to_save = response.content[0].text

            path = save_specific_content_to_pdf(title=topic, content=content_to_save)
            print(f'Saved to {path}')
            continue

        reply = reply_func(message, history, system_message)
        print(f'{agent_name}: {reply}')