const ATPROTO_DID = `did:plc:samplesamplesample`; // TODO

const wellknownHandler = (path: string): { body: string; contentType: string; status: number } => {
	if (path === `/.well-known/atproto-did`) {
		return { body: ATPROTO_DID, contentType: 'text/plain;charset=UTF-8', status: 200 };
	} else {
		return { body: 'Not Found', contentType: 'text/plain;charset=UTF-8', status: 404 };
	}
};

const wellknownResponse = (path: string): Response => {
	const { body, contentType, status } = wellknownHandler(path);
	return new Response(body, {
		status: status,
		headers: {
			'content-type': contentType,
		},
	});
};

export { wellknownResponse };
