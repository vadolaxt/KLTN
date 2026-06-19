from prompt import generate_response_prompt

def generate_response(llm, query, context):
    prompt = generate_response_prompt(context, query)

    response = llm.invoke(prompt)

    if hasattr(response, "content"):
        return response.content.strip()

    return str(response).strip()