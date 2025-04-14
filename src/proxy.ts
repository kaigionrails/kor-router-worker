const CURRENT_EVENT = '2024';
const CURRENT_EVENT_HOST = `${CURRENT_EVENT}.kaigionrails.org`;
const CURRENT_EVENT_PATH = `/${CURRENT_EVENT}`;
const PAST_EVENT_HOST = 'past.kaigionrails.org';
const KAIGIONRAILS_ORG = 'kaigionrails.org';

const INDEX = `<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="refresh" content="0;URL=${CURRENT_EVENT_PATH}/">
  </head>
  <body>
    <a href="${CURRENT_EVENT_PATH}/">Kaigi on Rails ${CURRENT_EVENT}</a>
  </body>
</html>
`;

const proxy = async (req: Request): Promise<Response> => {
	const requestUrl = new URL(req.url);
	if (requestUrl.pathname.startsWith(CURRENT_EVENT_PATH)) {
		requestUrl.hostname = CURRENT_EVENT_HOST;
	} else {
		requestUrl.hostname = PAST_EVENT_HOST;
	}
	const response = await fetch(requestUrl.toString(), { redirect: 'manual' });

	// Moved Permanently
	// 例えば /2023/cfp にアクセスした場合にはGitHub Pages側で /2023/cfp/ にリダイレクトされる
	if (response.status === 301) {
		const locationPath = new URL(response.headers.get('Location') as string).pathname;
		requestUrl.pathname = locationPath;
		requestUrl.hostname = KAIGIONRAILS_ORG;
		return Response.redirect(requestUrl.toString(), 301);
	}

	return new Response(response.body as ReadableStream, {
		status: response.status,
		statusText: response.statusText,
		headers: response.headers,
	});
};

const redirectToCurrentEvent = (): Response => {
	return new Response(INDEX, {
		headers: {
			'content-type': 'text/html;charset=UTF-8',
		},
	});
};

export { proxy, redirectToCurrentEvent };
